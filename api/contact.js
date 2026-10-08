import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { Resend } from "resend";

const REQUIRED_FIELDS = ["firstName", "lastName", "email", "consent"];
const MAX_REQUEST_BYTES = 16 * 1024;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const MAX_LENGTHS = {
  firstName: 100,
  lastName: 100,
  email: 254,
  phone: 40,
  jobFunction: 120,
  company: 150,
  industry: 120,
  country: 120,
  service: 120,
  source: 160,
  message: 4000,
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizeValue = (value) => (typeof value === "string" ? value.trim() : "");

const getRequestBodySize = (body) => {
  if (body === undefined || body === null) return 0;
  if (typeof body === "string") return Buffer.byteLength(body, "utf8");
  if (Buffer.isBuffer(body)) return body.length;
  if (body instanceof Uint8Array) return body.byteLength;

  try {
    return Buffer.byteLength(JSON.stringify(body), "utf8");
  } catch {
    return Infinity;
  }
};

const rejectOversizedRequest = (req, res) => {
  const contentLength = req.headers["content-length"];
  if (contentLength !== undefined) {
    const parsedLength = Number(contentLength);
    if (!Number.isSafeInteger(parsedLength) || parsedLength < 0) {
      res.status(400).json({ success: false, error: "Invalid request body." });
      return true;
    }
    if (parsedLength > MAX_REQUEST_BYTES) {
      res.status(413).json({ success: false, error: "Request body is too large." });
      return true;
    }
  }

  if (getRequestBodySize(req.body) > MAX_REQUEST_BYTES) {
    res.status(413).json({ success: false, error: "Request body is too large." });
    return true;
  }

  return false;
};

const isJsonContentType = (value) =>
  typeof value === "string" && /^application\/json(?:\s*;\s*charset=utf-8)?\s*$/i.test(value);

// Configure both Upstash credentials server-side in Vercel; never skip the shared limiter.
const checkRateLimit = async (ipAddress) => {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    throw new Error("Contact rate limiter is not configured.");
  }

  const endpoint = new URL(redisUrl);
  if (
    endpoint.protocol !== "https:" ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash ||
    (endpoint.pathname !== "" && endpoint.pathname !== "/")
  ) {
    throw new Error("Contact rate limiter configuration is invalid.");
  }

  const ipHash = createHmac("sha256", redisToken).update(ipAddress).digest("hex");
  const script = [
    "local count = redis.call('INCR', KEYS[1])",
    "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end",
    "return {count, redis.call('TTL', KEYS[1])}",
  ].join("\n");
  const response = await fetch(endpoint.origin, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      script,
      "1",
      `contact:v1:${ipHash}`,
      String(RATE_LIMIT_WINDOW_SECONDS),
    ]),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Contact rate limiter request failed with status ${response.status}.`);
  }

  const result = await response.json();
  if (result.error || !Array.isArray(result.result) || result.result.length !== 2) {
    throw new Error("Contact rate limiter returned an invalid response.");
  }

  const [count, ttl] = result.result.map(Number);
  if (!Number.isInteger(count) || !Number.isInteger(ttl) || ttl < 0) {
    throw new Error("Contact rate limiter returned invalid limits.");
  }

  return { allowed: count <= RATE_LIMIT_MAX_REQUESTS, retryAfter: Math.max(ttl, 1) };
};

const buildEmailText = (payload) => {
  const lines = [
    "New website inquiry — Rangnova",
    "",
    `Name: ${payload.firstName} ${payload.lastName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Job function: ${payload.jobFunction || "Not provided"}`,
    `Company: ${payload.company || "Not provided"}`,
    `Industry: ${payload.industry || "Not provided"}`,
    `Country: ${payload.country || "Not provided"}`,
    `Service: ${payload.service || "Not provided"}`,
    `Source: ${payload.source || "Not provided"}`,
    `Message: ${payload.message || "Not provided"}`,
    `Consent: ${payload.consent ? "Yes" : "No"}`,
  ];

  return lines.join("\n");
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  if (!isJsonContentType(req.headers["content-type"])) {
    return res.status(415).json({ success: false, error: "Content-Type must be application/json." });
  }

  if (rejectOversizedRequest(req, res)) return;

  const apiKey = process.env.RESEND_API_KEY;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !contactToEmail || !contactFromEmail) {
    return res.status(500).json({ success: false, error: "Email service is not configured." });
  }

  let payload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ success: false, error: "Invalid request body." });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res.status(400).json({ success: false, error: "Invalid request body." });
  }

  if (normalizeValue(payload.website)) {
    return res.status(400).json({ success: false, error: "Invalid request." });
  }

  const safePayload = {
    firstName: normalizeValue(payload.firstName),
    lastName: normalizeValue(payload.lastName),
    email: normalizeValue(payload.email),
    phone: normalizeValue(payload.phone),
    jobFunction: normalizeValue(payload.jobFunction),
    company: normalizeValue(payload.company),
    industry: normalizeValue(payload.industry),
    country: normalizeValue(payload.country),
    service: normalizeValue(payload.service),
    source: normalizeValue(payload.source),
    message: normalizeValue(payload.message),
    consent: payload.consent === true,
  };

  for (const field of REQUIRED_FIELDS) {
    const value = safePayload[field];
    if (field === "consent") {
      if (!value) {
        return res.status(400).json({ success: false, error: "Consent is required." });
      }
      continue;
    }

    if (!value) {
      return res.status(400).json({ success: false, error: `${field} is required.` });
    }
  }

  if (!isValidEmail(safePayload.email)) {
    return res.status(400).json({ success: false, error: "Please provide a valid email address." });
  }

  for (const [key, value] of Object.entries(safePayload)) {
    if (!(key in MAX_LENGTHS)) continue;
    if (value.length > MAX_LENGTHS[key]) {
      return res.status(400).json({ success: false, error: `${key} is too long.` });
    }
  }

  const ipAddress = req.headers["x-real-ip"];
  if (typeof ipAddress !== "string" || !isIP(ipAddress)) {
    console.error("Contact submission rejected because a trusted client IP is unavailable.");
    return res.status(503).json({ success: false, error: "Unable to process your inquiry right now. Please try again later." });
  }

  let rateLimit;
  try {
    rateLimit = await checkRateLimit(ipAddress);
  } catch (error) {
    console.error("Contact rate limiter failed", error);
    return res.status(503).json({ success: false, error: "Unable to process your inquiry right now. Please try again later." });
  }

  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfter));
    return res.status(429).json({ success: false, error: "Too many inquiries. Please try again later." });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: contactFromEmail,
      to: [contactToEmail],
      replyTo: safePayload.email,
      subject: "New website inquiry — Rangnova",
      text: buildEmailText(safePayload),
    });

    if (error) {
      console.error("Resend email failed", error);
      return res.status(502).json({ success: false, error: "Unable to send your inquiry right now. Please try again later." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend email failed", error);
    return res.status(502).json({ success: false, error: "Unable to send your inquiry right now. Please try again later." });
  }
}

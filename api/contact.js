import { Resend } from "resend";

const REQUIRED_FIELDS = ["firstName", "lastName", "email", "consent"];
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

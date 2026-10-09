import React from "react";
import { useI18n } from "../i18n";
import {
  Reveal,
  PageHero,
  BrandOrbit,
  ArrowLink,
} from "../sharedComponents";

export default function PrivacyPage() {
  const { t } = useI18n();
  const sections = [
    ["privacy.infoTitle", "privacy.infoBody"],
    ["privacy.purposeTitle", "privacy.purposeBody"],
    ["privacy.deliveryTitle", "privacy.deliveryBody"],
    ["privacy.technicalTitle", "privacy.technicalBody"],
    ["privacy.providersTitle", "privacy.providersBody"],
    ["privacy.retentionTitle", "privacy.retentionBody"],
    ["privacy.rightsTitle", "privacy.rightsBody"],
    ["privacy.changesTitle", "privacy.changesBody"],
  ];
  return (
    <>
      <PageHero
        eyebrow={t("PRIVACY")}
        title={<>{t("privacyTitleFirst")}<br /><em>{t("privacyTitleEmphasis")}</em></>}
        description={t("privacy.pageDescription")}
        graphic={<BrandOrbit />}
      />
      <section className="privacy-section section-pad">
        <Reveal className="container privacy-content">
          <h2>{t("Privacy Policy")}</h2>
          <p>{t("privacy.introBody")}</p>
          {sections.map(([title, body]) => (
            <section key={title} aria-labelledby={title}>
              <h3 id={title}>{t(title)}</h3>
              <p>{t(body)}</p>
            </section>
          ))}
          <ArrowLink to="/contact">{t("privacy.contactLink")}</ArrowLink>
        </Reveal>
      </section>
    </>
  );
}

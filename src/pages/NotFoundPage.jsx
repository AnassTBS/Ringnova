import React from "react";
import { useI18n } from "../i18n";
import {
  Reveal,
  PageHero,
  BrandOrbit,
  ButtonLink,
} from "../sharedComponents";

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHero
        eyebrow={t("PAGE NOT FOUND")}
        title={<>{t("This page went")}<br /><em>{t("off script.")}</em></>}
        description={t("The page may have moved, or the address may be incorrect.")}
        graphic={<BrandOrbit />}
      />
      <section className="privacy-section section-pad">
        <Reveal className="container privacy-content">
          <h2>{t("Let's get you back on track.")}</h2>
          <p>{t("Try the homepage or use the navigation to find what you need.")}</p>
          <ButtonLink to="/">{t("Back to home")}</ButtonLink>
        </Reveal>
      </section>
    </>
  );
}

import { ERoutePath } from "@/app/constants/path";
import CategoryHeroImage from "@/components/platform/product/shared/HeroImage";
import { IBreadcrumb } from "@/interfaces/common";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import TimeLineItem from "@/components/common/TimeLineItem";
import FooterBanner from "@/components/common/FooterBanner";
import happyFounder from "@/assets/images/happy-founder-video.png";

const URL_VIDEO = "https://www.youtube.com/embed/tgbNymZ7vqY";

const categoriesList = (
  t: TFunction<"translation", undefined>
): IBreadcrumb[] => {
  return [
    {
      label: t("header.menu.home"),
      link: ERoutePath.HOME,
      isActive: false,
    },
    {
      label: t("header.menu.about us"),
      link: ERoutePath.ABOUT_US,
      isActive: false,
    },
    {
      label: t("header.menu.creator message"),
      link: ERoutePath.ABOUT_US_MESSAGE,
      isActive: true,
    },
  ];
};
function FounderMessagePage() {
  const { t } = useTranslation();
  return (
    <main>
      <CategoryHeroImage categories={categoriesList(t)} title="About us" />
      <div className={styles.founderMessage}>
        <div className={styles.wrapContent}>
          <h2 className={styles.title}>{t("aboutUs.founderMessage.title")}</h2>
          <div className={styles.wrapQuote}>
            <div className={styles.quote}>
              <span>{t("aboutUs.founderMessage.missionQuote")}</span>
            </div>
          </div>
          <p className={styles.description}>
            {t("aboutUs.founderMessage.missionDescription")}
          </p>

          <div className={styles.wrapIframe}>
            <img src={happyFounder} width="100%" height="100%" />
            {/* <iframe width="100%" height="100%" src={URL_VIDEO}></iframe> */}
          </div>

          <div className={styles.founderInfo}>
            <div className={styles.wrapTimeline}>
              <TimeLineItem>
                <span className={styles.founderInfo__title}>
                  {t("aboutUs.founderMessage.founderInfoTitle")}
                </span>
              </TimeLineItem>
            </div>
            <p className={styles.founderInfo__name}>
              {t("aboutUs.founderMessage.founder name")}
            </p>
            <p className={styles.founderInfo__quoteDetail}>
              {t("aboutUs.founderMessage.founderQuote")}
            </p>
            {/* <p className={styles.founderInfo__quoteDetail}>
              {t("aboutUs.founderMessage.address")}: Block C, 2/F, HongKong
              Industrial Centre, No.489-491, Castle Peak Road, Kowloon HongKong.
            </p> */}
          </div>
        </div>
      </div>
      <FooterBanner />
    </main>
  );
}

export default FounderMessagePage;

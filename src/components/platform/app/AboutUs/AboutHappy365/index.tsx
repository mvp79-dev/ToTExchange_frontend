import { Trans, useTranslation } from "react-i18next";

import TimeLineItem from "@/components/common/TimeLineItem";
import styles from "./styles.module.scss";
import About1Img from "@/assets/images/about-1.jpg";
import About2Img from "@/assets/images/about-2.jpg";
import About3Img from "@/assets/images/happy-founder.png";
import FooterBanner from "@/components/common/FooterBanner";

function AboutUsPage() {
  const { t } = useTranslation();

  return (
    <div className={styles["about-us"]}>
      <main className={styles["page-container"]}>
        <section className={styles["about-us__section"]}>
          <div
            className={`${styles["about-us__section__content"]} ${styles["flex-col"]} ${styles["paragraph-gap"]}`}
          >
            <div>
              <TimeLineItem>
                <span className={styles["about-us__timeline-text"]}>
                  {t("aboutUs.aboutHappy365.our story")}
                </span>
              </TimeLineItem>
              <h2 className={styles["about-us__section__title"]}>
                {t("aboutUs.aboutHappy365.about Happy365Global")}
              </h2>
            </div>

            <div className={styles["quote"]}>
              <span>{t("aboutUs.aboutHappy365.mission quote")}</span>
            </div>
            <p>{t("aboutUs.aboutHappy365.mission description")}</p>
          </div>
          <div className={styles["about-us__section__img"]}>
            <img src={About1Img} alt="" width={550} />
          </div>
        </section>

        <section className={`${styles["flex-col"]} ${styles["paragraph-gap"]}`}>
          <img src={About2Img} alt="" width="100%" />
          <Trans
            i18nKey="aboutUs.aboutHappy365.description"
            components={{
              p: <p />,
            }}
          />
        </section>

        <section className={styles["about-us__section"]}>
          <div className={styles["about-us__section__img"]}>
            <img src={About3Img} alt="" width={550} />
          </div>
          <div
            className={`${styles["about-us__section__content"]} ${styles["flex-col"]} ${styles["paragraph-gap"]}`}
          >
            <div>
              <TimeLineItem>
                <span className={styles["about-us__timeline-text"]}>
                  {t("aboutUs.aboutHappy365.fouder")}
                </span>
              </TimeLineItem>
              <h3 className={styles["about-us__section__title"]}>
                {t("aboutUs.founderMessage.founder name")}
              </h3>
            </div>

            <Trans
              i18nKey="aboutUs.aboutHappy365.about founder"
              components={{
                p: <p />,
              }}
            />
          </div>
        </section>

        <section className={`${styles["flex-col"]} ${styles["paragraph-gap"]}`}>
          <Trans
            i18nKey="aboutUs.aboutHappy365.description-2"
            components={{
              p: <p />,
            }}
          />
        </section>
      </main>

      <FooterBanner />
    </div>
  );
}

export default AboutUsPage;

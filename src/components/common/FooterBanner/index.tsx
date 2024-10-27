import { useTranslation } from "react-i18next";

import AffiliateImg from "@/assets/images/d39d3d1bd3444f3e9aa4621bebad956d.jpg";

import styles from "./style.module.scss";

interface IProps {
  children?: React.ReactNode;
}

function FooterBanner({ children }: IProps) {
  const { t } = useTranslation();

  return (
    <div
      className={styles["hero-img"]}
      style={{
        backgroundImage: `url(${AffiliateImg})`,
        backgroundSize: "130%",
        backgroundPosition: "center 62%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children ?? (
        <div>
          <h2 className={styles["footer-banner"]}>
            {t("aboutUs.aboutHappy365.footer-banner")}
          </h2>
        </div>
      )}
    </div>
  );
}

export default FooterBanner;

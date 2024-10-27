import AffiliateImg from "@/assets/images/d39d3d1bd3444f3e9aa4621bebad956d.jpg";

import { useTranslation } from "react-i18next";

import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { useAppSelector } from "@/app/hooks";

function RegisterAffiliateBanner() {
  const { t } = useTranslation();
  const isLoggedIn = !!useAppSelector((state) => state.user.user);

  if (isLoggedIn) {
    return null;
  }

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
      <div>
        <h1 className={styles["hero-img__title"]}>
          {t("products.register_affiliate")}
        </h1>
        <Link to={ERoutePath.REGISTER} className={styles["hero-img__register"]}>
          {t("products.register_now")}
        </Link>
      </div>
    </div>
  );
}

export default RegisterAffiliateBanner;

import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/app/hooks";

function InternalUserPoint() {
  const { t } = useTranslation();
  const balance = useAppSelector((state) => state.user.user?.balance);

  return (
    <div className={styles["internal-point"]}>
      <p>{t("cart.Estimated Balance")}</p>
      <p>
        <span>~</span>
        <span className={styles["internal-point__convert-balance"]}>
          ${balance}
        </span>
      </p>
    </div>
  );
}

export default InternalUserPoint;

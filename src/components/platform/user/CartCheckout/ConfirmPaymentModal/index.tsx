import { useTranslation } from "react-i18next";
import HPModal from "@/components/common/HPModal";

import styles from "./style.module.scss";

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
function ConfirmPaymentModal({ open, onClose, onConfirm }: IProps) {
  const { t } = useTranslation();
  return (
    <HPModal
      open={open}
      onClose={onClose}
      onOK={onConfirm}
      className={styles["modal-confirm-payment"]}
      textCustomBtnConfirm={t("resetPassword.btnConfirm")}
      textCustomBtnCancel={t("cart.Keep buying")}
    >
      <div>
        <h5 className={styles["modal-confirm-payment__title"]}>
          {t("cart.ConfirmYourOrder")}
        </h5>
        <p className={styles["modal-confirm-payment__info"]}>
          {t("cart.YoureStillCanBuyMoreStuffsThatSuitYouInOurStore")}
        </p>
        <p
          className={`${styles["modal-confirm-payment__info"]} ${styles["warning"]}`}
        >
          {t("cart.confirm order note")}
        </p>
      </div>
    </HPModal>
  );
}

export default ConfirmPaymentModal;

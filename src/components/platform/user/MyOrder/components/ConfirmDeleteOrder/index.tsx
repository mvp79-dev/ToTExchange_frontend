import HPModal from "@/components/common/HPModal";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss";

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export function ConfirmDeleteOrder({ open, onClose, onConfirm }: IProps) {
  const { t } = useTranslation();
  return (
    <HPModal
      open={open}
      onClose={onClose}
      onOK={onConfirm}
      className={styles["modal-confirm-deleteOrder"]}
      textCustomBtnConfirm={t("resetPassword.btnConfirm")}
      textCustomBtnCancel={t("myOrder.allOrder.detail.exit")}
    >
      <h5>{t("myOrder.allOrder.detail.doYouWantToCancel")}</h5>
    </HPModal>
  );
}

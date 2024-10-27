import HPModal from "@/components/common/HPModal";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
};

export default function ModalConfirmDelCart({ open, onClose, onClick }: Props) {
  const { t } = useTranslation();
  return (
    <HPModal
      open={open}
      onClose={onClose}
      onOK={onClick}
      className={styles["modal-confirm-del"]}
      textCustomBtnConfirm={t("resetPassword.btnConfirm")}
    >
      <div className={styles.modalConfirmDel}>
        <p className={styles.modalConfirmDel__title}>
          {t("cart.modalDelContent")}
        </p>
      </div>
    </HPModal>
  );
}

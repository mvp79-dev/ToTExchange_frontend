import HPModal from "@/components/common/HPModal";
import { IShippingAddressForm } from "@/interfaces/shippingAddress";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  infoAddress: IShippingAddressForm;
  onOK: () => void;
};

export default function ModalConfirmChooseAddressDefault({
  open,
  onClose,
  infoAddress,
  onOK,
}: Props) {
  const { t } = useTranslation();
  return (
    <HPModal open={open} onClose={onClose} onOK={onOK}>
      <div className={style.modal}>
        <p>{t("modal.modalConfirmChooseAddressDefault.title")}</p>
        <p>{infoAddress.street}</p>
      </div>
    </HPModal>
  );
}

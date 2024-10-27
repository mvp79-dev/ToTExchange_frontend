import HPModal from "@/components/common/HPModal";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = { open: boolean; onClose: () => void; value?: string | number };

export default function ModalWarningQuantityLimitProduct({
  open,
  onClose,
  value,
}: Props) {
  const { t } = useTranslation();
  return (
    <HPModal open={open} onClose={onClose} footer={""}>
      <p>
        {t("modal.modalWarningQuantityLimit.content_1")} {value}{" "}
        {t("modal.modalWarningQuantityLimit.content_2")}
      </p>
    </HPModal>
  );
}

import { Modal } from "antd";
import { ReactNode } from "react";
import style from "./style.module.scss";
import classNames from "classnames";

type Props = {
  title?: string | ReactNode;
  footer?: string | ReactNode;
  open: boolean;
  onClose: () => void;
  onOK?: () => void;
  width?: string | number;
  className?: string;
  maskClosable?: boolean;
  children?: ReactNode;
  textCustomBtnConfirm?: string | ReactNode;
  textCustomBtnCancel?: string | ReactNode;
  closeIcon?: boolean | ReactNode;
  loading?: boolean;
};

export default function HPModal({
  title,
  footer,
  onClose,
  open,
  width,
  className,
  children,
  maskClosable = true,
  onOK,
  textCustomBtnConfirm,
  textCustomBtnCancel,
  closeIcon = false,
  loading = false,
}: Props) {
  return (
    <Modal
      title={title}
      footer={footer}
      open={open}
      onCancel={onClose}
      onOk={onOK}
      width={width}
      centered
      maskClosable={maskClosable}
      className={classNames(className, style.hpModal)}
      okText={textCustomBtnConfirm}
      cancelText={textCustomBtnCancel}
      closeIcon={closeIcon}
      confirmLoading={loading}
    >
      <div>{children}</div>
    </Modal>
  );
}

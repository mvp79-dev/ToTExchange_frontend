import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { EToastType } from "../interface";
import style from "./style.module.scss";

type Props = {
  message: string;
  onClose: () => void;
  type: EToastType;
};

const Toast = ({ message, type, onClose }: Props) => {
  const iconMap: any = {
    success: <CheckCircleOutlined />,
    error: <CloseCircleOutlined />,
    warning: <WarningOutlined />,
    info: <InfoCircleOutlined />,
  };

  const toastIcon = iconMap[type] || null;

  const renderColor = () => {
    switch (type) {
      case EToastType.error:
        return style.toastError;
      case EToastType.success:
        return style.toastSuccess;
      case EToastType.warning:
        return style.toastWaring;
      default:
        return style.toastInfo;
    }
  };

  return (
    <div className={classNames(style.toast)} role="alert">
      <div className={style.toastMessage}>
        {toastIcon && <div className={renderColor()}>{toastIcon}</div>}
        <p>{message}</p>
      </div>
      <span className={style.iconCLose} onClick={onClose}>
        <CloseOutlined />
      </span>
    </div>
  );
};

export default Toast;

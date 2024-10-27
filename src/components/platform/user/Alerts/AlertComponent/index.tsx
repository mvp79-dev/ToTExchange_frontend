import { EAlertType, IAlert } from "@/interfaces/alert";
import styles from "./style.module.scss";
import _ from "lodash";
import IconMail from "@/assets/icons/mailIcon.svg";
import IconIdentity from "@/assets/icons/identityIcon.svg";
import { generatePath, useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { useTranslation } from "react-i18next";

export const AlertColors: Record<EAlertType, string> = {
  [EAlertType.REP_ORDER]: "#52C41A",
  [EAlertType.REP_SIGNUP]: "#9DCA00",
  [EAlertType.COMMISSIONS]: "#1677FF",
  [EAlertType.CELEBRATION]: "#F5222D",
};

type Props = {
  label: string;
  date: string;
  content: string;
  color: string;
  icon: string;
  action: number;
  orderCustomId: string;
  orderId: string | number;
  nameRef: string;
  emailRef: string;
  type: EAlertType;
};

export default function AlertComponent(props: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickItem = () => {
    if (props.type != EAlertType.REP_ORDER) return;
    navigate(`${ERoutePath.MY_ORDER}?orderId=${props.orderId}`);
  };

  return (
    <div
      className={styles.alertItem}
      style={{
        cursor: props.type === EAlertType.REP_ORDER ? "pointer" : "auto",
      }}
      onClick={onClickItem}
    >
      <div className={styles.alertItem__header}>
        <div className={styles.wrapTitle}>
          <div className={styles.icon} style={{ backgroundColor: props.color }}>
            <img src={props.icon} />
          </div>
          <div className={styles.title}>
            <p className={styles.title__main}>{props.label}</p>
            <p className={styles.title__sub}>{props.date}</p>
          </div>
        </div>
        <div className={styles.moreInfo}>
          {props.action === EAlertType.REP_ORDER && (
            <div className={styles.itemOrderLabel}>
              <span className={styles.itemOrderLabel__title}>
                {t("header.menuUser.order")}
              </span>
              <span className={styles.itemOrderLabel__id}>
                {props.orderCustomId}
              </span>
            </div>
          )}
          {props.action === EAlertType.REP_SIGNUP && (
            <div className={styles.itemOrderLabel}>
              <span>{props.nameRef}</span>
              <a
                href={`mailto:${props.emailRef}`}
                target="_blank"
                rel="noreferrer"
              >
                <img src={IconMail} alt="" />
              </a>
              <span>
                <img src={IconIdentity} alt="" />
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.alertItem__content}>{props.content}</div>
      <div className={styles.moreInfo}>
        {props.action === EAlertType.REP_ORDER && (
          <div className={styles.itemOrderLabel}>
            <span className={styles.itemOrderLabel__title}>
              {t("header.menuUser.order")}
            </span>
            <span className={styles.itemOrderLabel__id}>
              {props.orderCustomId}
            </span>
          </div>
        )}
        {props.action === EAlertType.REP_SIGNUP && (
          <div className={styles.itemOrderLabel}>
            <span>{props.nameRef}</span>
            <a
              href={`mailto:${props.emailRef}`}
              target="_blank"
              rel="noreferrer"
            >
              <img src={IconMail} alt="" />
            </a>
            <span>
              <img src={IconIdentity} alt="" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

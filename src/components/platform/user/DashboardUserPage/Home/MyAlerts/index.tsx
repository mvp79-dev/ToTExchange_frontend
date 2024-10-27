import IconIdentity from "@/assets/icons/identityIcon.svg";
import IconMail from "@/assets/icons/mailIcon.svg";
import style from "./style.module.scss";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { AlertSelect, alertActions } from "@/features/alert/alertSlice";
import { alertDataAdapter } from "@/helpers/adapters/AlertAdapter";
import { EAlertType } from "@/interfaces/alert";
import { Empty } from "antd";
import HPTooltip from "@/components/common/HPTooltip";
import { truncateText } from "@/app/common/helper";
import classNames from "classnames";

interface IMyAlert {
  label: string;
  date: string;
  content: string;
  action: number;
  icon: ReactNode;
  color: string;
}

const DEFAULT_PAGE = 1;

export default function MyAlert() {
  const { t } = useTranslation();
  const { listAlert } = useAppSelector(AlertSelect);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      alertActions.getListAlertsRequest({ size: 6, page: DEFAULT_PAGE })
    );
  }, [dispatch]);

  const dataTransfer = listAlert.map((alert, index) => {
    return alertDataAdapter.convertDataAlertResponseApi(alert, t);
  });
  const navigate = useNavigate();
  return (
    <div className={style.myAlert}>
      <div className={style.header}>
        <span className={style.title}>{t("dashboardUser.myAlerts.title")}</span>
        <div
          className={style.action}
          onClick={() => navigate(ERoutePath.MY_ALERTS)}
        >
          {t("dashboardUser.myAlerts.textAction")}
        </div>
      </div>
      <div className={style.myAlertList}>
        {dataTransfer.length ? (
          dataTransfer.map((data, index) => (
            <div className={style.myAlertItem} key={index}>
              <div className={style.header}>
                <div className={style.info}>
                  <div
                    className={style.image}
                    style={{ backgroundColor: data.color }}
                  >
                    <img src={data.icon} />
                  </div>
                  <div className={style.name}>
                    <div>{data.label}</div>
                    <span>{data.date}</span>
                  </div>
                </div>
              </div>
              <div className={style.desc}>
                <HPTooltip
                  title={data.content}
                  icon={truncateText(data.content, 70, 0)}
                  maxWidth={350}
                />
              </div>
              <div
                className={classNames(style.contact, {
                  [style["order"]]: data.action !== EAlertType.REP_SIGNUP,
                })}
              >
                {data.action === EAlertType.REP_SIGNUP ? (
                  <>
                    <span>{data.nameRef}</span>
                    <span>
                      <a
                        href={`mailto:${data.emailRef}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={IconMail} alt="" />
                      </a>
                    </span>
                    <span>
                      <img src={IconIdentity} alt="" />
                    </span>
                  </>
                ) : (
                  <div>
                    <span>{t("header.menuUser.order")}</span>
                    <span className={style.highlightText}>
                      {data?.orderCustomId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
}

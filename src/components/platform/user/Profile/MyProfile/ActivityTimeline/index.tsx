import { EFormatDate } from "@/app/common/formatDate";
import { EActivityAction } from "@/app/constants/socket";
import HPTable, { IPaginationTable } from "@/components/common/HPTable";
import { IColumn, IQuery, IResponseArray } from "@/interfaces/common";
import { IActivityTimeline } from "@/interfaces/user";
import { userServices } from "@/service/userService";
import { ArrowUpOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import style from "./style.module.scss";
import { truncateText } from "@/app/common/helper";
import HPTooltip from "@/components/common/HPTooltip";
import { getLastDate } from "@/app/common/date";
import { useMediaQuery } from "react-responsive";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";
import HPPagination from "@/components/common/HPPagination";

export enum EHashProfile {
  activityTimeline = "#activity-timeline",
}

export enum EHashCustom {
  TRANSFER_TO_ID = "TRANSFER_TO_ID",
  TRANSFER_TO_EMAIL = "TRANSFER_TO_EMAIL",
  WITHDRAW_TO_EXTERNAL_WALLET = "WITHDRAW_TO_EXTERNAL_WALLET",
}

export default function ActivityTimeline() {
  const { t } = useTranslation();

  const elementRef = useRef<any>(null);
  const isPortraitTable = useMediaQuery({ maxWidth: EResponsiveBreakpoint.sm });

  const [data, setData] = useState<{
    data: IActivityTimeline[];
    meta: { count: number; totalPages: number };
  }>({ data: [], meta: { count: 0, totalPages: 0 } });
  const [params, setParams] = useState<IQuery>({
    page: 1,
    size: 10,
  });

  const getActivityTimelines = useCallback(async () => {
    const [res, error] = await userServices.getActivityTimelines(params);
    if (res as IResponseArray<IActivityTimeline>) {
      setData({ data: res.data, meta: res.meta });
    }
  }, [params]);

  useEffect(() => {
    getActivityTimelines();
  }, [getActivityTimelines]);

  const renderDesc = (record: IActivityTimeline) => {
    switch (record.action) {
      case EActivityAction.REP_SIGNUP:
        return (
          <>
            {t("profile.activityTimeline.descReUp", {
              desc: record.description,
            })}
          </>
        );
      case EActivityAction.REP_ORDER:
        return (
          <>
            {t("profile.activityTimeline.descOrder", {
              desc: record.description,
              amount: record?.amount,
            })}
          </>
        );
      case EActivityAction.DEPOSIT:
        return (
          <>
            {t("profile.activityTimeline.descDeposit", {
              amount: record.amount,
              currency: "USDT",
            })}
          </>
        );
      case EActivityAction.WITHDRAW:
        return (
          <>
            {t("profile.activityTimeline.descWithdraw", {
              amount: record.amount,
              currency: "USDT",
            })}{" "}
            {record.hashCustom.startsWith(
              EHashCustom.WITHDRAW_TO_EXTERNAL_WALLET
            )
              ? !!record?.withDrawRequest && (
                  <>
                    Wallet address:
                    <Link
                      to={`${process.env.REACT_APP_URL_SCAN}/address/${record.withDrawRequest?.receiverAddress}`}
                      target="_blank"
                    >
                      <HPTooltip
                        title={record?.withDrawRequest?.receiverAddress}
                        icon={`${truncateText(
                          record?.withDrawRequest?.receiverAddress
                        )}`}
                        width={400}
                        maxWidth={400}
                      />{" "}
                    </Link>
                  </>
                )
              : !!record?.withDrawRequest && (
                  <span className={style.highlightText}>
                    {record.hashCustom.startsWith(EHashCustom.TRANSFER_TO_EMAIL)
                      ? `Email: ${record.withDrawRequest?.receiverEmail}`
                      : `User ID: #${record.withDrawRequest?.receiverId}`}
                  </span>
                )}
          </>
        );
      case EActivityAction.BUY_NFT:
        return (
          <>
            {t("profile.activityTimeline.descBuyNFT", {
              amount: record.amount,
              currency: "$",
            })}{" "}
          </>
        );
      case EActivityAction.UPGRADE_NFT:
        return (
          <>
            {t("profile.activityTimeline.descUpgradeNFT", {
              amount: record.amount,
              currency: "$",
            })}{" "}
          </>
        );
      case EActivityAction.CANCEL_ORDER:
        return (
          <>
            {t("profile.activityTimeline.descCancelOrder", {
              desc: record.description,
              amount: record?.amount,
            })}{" "}
          </>
        );
      default:
        return <></>;
    }
  };

  const columns: Array<IColumn> = [
    {
      title: t("profile.textTitleTableDate"),
      dataIndex: "createdAt",
      key: "date",
      render: (createdAt: string) => {
        return (
          <span>
            {dayjs(createdAt).format(EFormatDate["HH:mm DD/MM/YYYY"])}
          </span>
        );
      },
    },
    {
      title: "Hash",
      dataIndex: "hashCustom",
      key: "hash",
      render: (hash: string, record: IActivityTimeline) => {
        switch (record.action) {
          case EActivityAction.BUY_NFT:
            return (
              !!record?.nft?.buyNFtTxHash && (
                <Link
                  to={`${process.env.REACT_APP_URL_SCAN}/tx/${record?.nft?.buyNFtTxHash}`}
                  className="hash"
                  target="_blank"
                >
                  Tx <ArrowUpOutlined />
                </Link>
              )
            );

          case EActivityAction.DEPOSIT:
            return (
              <Link
                to={`${process.env.REACT_APP_URL_SCAN}/tx/${hash}`}
                className="hash"
                target="_blank"
              >
                Tx <ArrowUpOutlined />
              </Link>
            );
          case EActivityAction.WITHDRAW:
            return (
              !!record.withDrawRequest?.txHash && (
                <Link
                  to={`${process.env.REACT_APP_URL_SCAN}/tx/${record.withDrawRequest?.txHash}`}
                  className="hash"
                  target="_blank"
                >
                  Tx <ArrowUpOutlined />
                </Link>
              )
            );

          default:
            return "N/A";
        }
      },
      width: "10%",
    },
    {
      title: t("profile.textTitleTableDescription"),
      dataIndex: "description",
      key: "description",
      render: (hash: string, record: IActivityTimeline) => {
        return renderDesc(record);
      },
    },
  ];

  const handleChangePagination = (data: IPaginationTable) => {
    elementRef?.current?.scrollIntoView({ behavior: "smooth" });
    setParams({ page: data.page, size: data.pageSize });
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash === EHashProfile.activityTimeline) {
      const id = EHashProfile.activityTimeline.substring(1);
      const targetElement = document.getElementById(id);
      if (targetElement) {
        elementRef?.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
    return () => {
      window.location.hash = "";
    };
  }, [location.hash, data]);

  return (
    <div id="activity-timeline">
      <div className={style.infoActivity} ref={elementRef}>
        <div className={style.infoActivity__header}>
          <div className={style.infoActivity__header__text}>
            <div className={style.title}>
              {t("profile.activityTimeline.title")}
            </div>
            <div className={style.date}>
              {t("profile.activityTimeline.textLastUpdated")}:{" "}
              {getLastDate(data.data)}
            </div>
          </div>
          {/* <div className={style.infoActivity__header__action}>
            <Button>{t("profile.btnViewMore")}</Button>
            <Button className="ant-btn-custom">
              {t("profile.btnCreateOrders")}
            </Button>
          </div> */}
        </div>
      </div>
      <div className={style.table}>
        {isPortraitTable ? (
          <>
            <ul className={style["infoActivity__list"]}>
              {data.data.map((item) => {
                return (
                  <li
                    key={item.id}
                    className={style["infoActivity__list__item"]}
                  >
                    {columns.map((col) => {
                      return (
                        <div key={col.key}>
                          <p>{col.title}</p>
                          <div>
                            {col.render(
                              item[col.dataIndex as keyof IActivityTimeline],
                              item
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </li>
                );
              })}
            </ul>
            <HPPagination
              showSizeChanger={false}
              className={style["infoActivity__list__pagination"]}
              isShowTotalItems={false}
              pageSize={params.size}
              currentPage={params.page}
              totalItem={params.size * data.meta.totalPages}
              onChange={(page, pageSize) =>
                handleChangePagination({
                  page,
                  pageSize,
                })
              }
            />
          </>
        ) : (
          <HPTable
            scroll={{ x: 600 }}
            columns={columns}
            pagination={{
              isShow: true,
              page: params.page,
              pageSize: params.size,
              totalPage: data.meta.totalPages,
              totalItem: data.meta.count,
            }}
            data={data.data}
            onChangePagination={handleChangePagination}
          />
        )}
      </div>
    </div>
  );
}

import { Button } from "antd";
import style from "./style.module.scss";
import ImageNFT from "@/assets/images/NFT-image.jpg";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/app/hooks";
import { useTranslation } from "react-i18next";
import HPTooltip from "@/components/common/HPTooltip";
import { EUserRole } from "@/interfaces/user";
import IconNFTVip from "@/assets/icons/iconNFTVip.svg";
import dayjs from "dayjs";
import { EFormatDate } from "@/app/common/formatDate";
import { EKeyPriceNFT } from "@/interfaces/marketplace";
import { EBuyNftStatus } from "@/service/marketplaceService";
import { useSocket } from "@/app/useSocket";
import { useEffect, useState } from "react";
import {
  ESocketAction,
  IPayloadListenSocket,
  SocketEvent,
} from "@/app/constants/socket";
import { toast } from "react-toastify";
import store from "@/app/store";
import { userActions } from "@/features/user/userSlice";
import { TFunction } from "i18next";
import classNames from "classnames";

type Props = { textBtn?: string; onClickBuy?: () => void };

const renderButton = (
  type: EBuyNftStatus | undefined,
  t: TFunction<"translation", undefined>
) => {
  switch (type) {
    case EBuyNftStatus.INITIALIZED:
    case EBuyNftStatus.MINTING:
      return t("marketplace.NFTItem.btnProcessing");
    case EBuyNftStatus.SUCCESS:
      return t("marketplace.NFTItem.btnDetail");
    default:
      return t("marketplace.NFTItem.btnBuy");
  }
};

export default function NFTItem({ textBtn = "Buy now", onClickBuy }: Props) {
  const { myNFT, user } = useAppSelector((state) => state.user);
  const { pricesNFT } = useAppSelector((state) => state.marketplace);
  const { t } = useTranslation();
  const [isProcessing, setProcessing] = useState(false);
  const { socket } = useSocket();

  const normalNFTPrice = pricesNFT.find(
    (el) => el.key === EKeyPriceNFT.nft_price
  )?.value;

  const isVIPNFT = myNFT?.vipExpiredAt
    ? dayjs(myNFT.vipExpiredAt).valueOf() > Date.now()
    : false;

  useEffect(() => {
    socket?.on(SocketEvent.events, (socket: IPayloadListenSocket) => {
      if (socket?.action === ESocketAction.BUY_NFT) {
        toast.success(t("marketplace.NFTItem.textBuyNFTSuccess"));
        store.dispatch(userActions.getMyNftRequest());
        setProcessing(false);
      }
    });
    return () => {
      socket?.off(SocketEvent.events);
    };
  }, [socket, t]);

  useEffect(() => {
    if (
      myNFT?.buyNftStatus === EBuyNftStatus.INITIALIZED ||
      myNFT?.buyNftStatus === EBuyNftStatus.MINTING
    ) {
      setProcessing(true);
    } else {
      setProcessing(false);
    }
  }, [myNFT?.buyNftStatus]);

  return (
    <div className={style.nftItem}>
      <div className={style.nftImg}>
        <img src={ImageNFT} />
      </div>
      <div className={style.nftBox}>
        {myNFT?.buyNftStatus && myNFT?.vipExpiredAt && (
          <HPTooltip
            title={t("marketplace.NFTItem.tooltipVFTVip")}
            width={140}
            icon={<img src={IconNFTVip} className={style.nftVip} />}
          />
        )}
        <div className={style.nftInfo}>
          {myNFT?.buyNftStatus ? (
            <>
              <span
                className={classNames(style.nftInfoUser, {
                  [style.hasVip]: isVIPNFT,
                })}
              >
                ID: {myNFT?.customId}
              </span>
              <span className={style.nftInfoUser}>
                {t("marketplace.NFTItem.textOwner")}: {user?.name}
              </span>
              {myNFT.vipExpiredAt && (
                <span className={style.nftInfoUser}>
                  {t("marketplace.NFTItem.textExpirationDate")}:{" "}
                  {dayjs(myNFT?.vipExpiredAt).format(EFormatDate["DD/MM/YYYY"])}
                </span>
              )}
              <span className={style.nftInfoUser}>
                {t("marketplace.NFTItem.textCreatedAt")}:{" "}
                {dayjs(myNFT?.createdAt).format(EFormatDate["DD/MM/YYYY"])}
              </span>
            </>
          ) : (
            <>
              <p className={style.nftName}>Equilibrium #3429</p>
              <div className={style.nftDesc}>
                {t("marketplace.NFTItem.nftDesc")}
              </div>
            </>
          )}
          <div className={style.nftBenefits}>
            <span>{t("marketplace.NFTItem.textBenefits")}:</span>
            <ul>
              <li>
                {t(
                  "marketplace.NFTItem.Profit from both referral product purchases and NFTs"
                )}
              </li>
              <li>
                {t("marketplace.NFTItem.Eligible to earn commissions up")}
              </li>
              <li>
                {t(
                  "marketplace.NFTItem.Unleash Premium can earn up to 12 levels"
                )}
              </li>
            </ul>
          </div>
          {!myNFT && (
            <span className={style.nftPrice}>
              {normalNFTPrice ? `$${normalNFTPrice}` : "--"}
            </span>
          )}
          <div
            className={style.nftAction}
            style={{ position: "relative", zIndex: 9999 }}
          >
            <HPTooltip
              title={
                user?.role !== EUserRole.collaborator
                  ? t("marketplace.NFTItem.tooltipWarning")
                  : ""
              }
              maxWidth={260}
              icon={
                <Button
                  disabled={user?.role !== EUserRole.collaborator}
                  onClick={onClickBuy}
                  icon={
                    myNFT?.buyNftStatus ? undefined : <ShoppingCartOutlined />
                  }
                  loading={isProcessing}
                >
                  {renderButton(myNFT?.buyNftStatus as EBuyNftStatus, t)}
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { EFormatDate } from "@/app/common/formatDate";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import HPModal from "@/components/common/HPModal";
import { Button, Divider, Radio } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { EKeyPriceNFT } from "@/interfaces/marketplace";
import ImageNFT from "@/assets/images/NFT-image.jpg";
import { useState, useMemo } from "react";

import { toast } from "react-toastify";
import { marketServices } from "@/service/marketplaceService";
import { userActions } from "@/features/user/userSlice";

import styles from "./styles.module.scss";
import { CloseOutlined } from "@ant-design/icons";

interface IProps {
  open: boolean;
  onClose: () => void;
  onClickUpgrade: () => void;
}

enum EUpgradeNFTType {
  NO_OPTION,
  RENEW_ONLY,
  UPGRADE_ONLY,
  BOTH_UPGRADE,
}

function ModalAutoRenewal({ onClose, open, onClickUpgrade }: IProps) {
  const { t } = useTranslation();
  const { myNFT, user } = useAppSelector((state) => state.user);
  const { pricesNFT } = useAppSelector((state) => state.marketplace);
  const [renewOption, setRenewOption] = useState<EUpgradeNFTType>(
    !myNFT
      ? EUpgradeNFTType.BOTH_UPGRADE
      : (Number(myNFT.autoUpgrade) << 1) + Number(myNFT.autoRenew)
  );
  const dispatch = useAppDispatch();

  const isReactivable =
    !!myNFT?.vipExpiredAt && dayjs(myNFT.vipExpiredAt).valueOf() < Date.now();

  const nftExpireTime = myNFT?.vipExpiredAt || myNFT?.nftExpiredAt;
  const isExpireNFT = !nftExpireTime
    ? false
    : dayjs(nftExpireTime).valueOf() < Date.now();

  const updateRenewHandler = useMemo(() => {
    return _.debounce(async (renewOption: EUpgradeNFTType) => {
      const renewPayload = {
        autoUpgrade: false,
        autoRenew: false,
      };

      switch (renewOption) {
        case EUpgradeNFTType.NO_OPTION:
          renewPayload.autoRenew = false;
          renewPayload.autoUpgrade = false;
          break;
        case EUpgradeNFTType.RENEW_ONLY:
          renewPayload.autoRenew = true;
          renewPayload.autoUpgrade = false;
          break;
        case EUpgradeNFTType.UPGRADE_ONLY:
          renewPayload.autoRenew = false;
          renewPayload.autoUpgrade = true;
          break;
        case EUpgradeNFTType.BOTH_UPGRADE:
          renewPayload.autoRenew = true;
          renewPayload.autoUpgrade = true;
          break;

        default:
          break;
      }

      const [_renewResponse, error] = await marketServices.updateAutoRenewNft(
        renewPayload
      );

      if (error) {
        toast.error(t("marketplace.modalUpgradeYourPackage.Renew failed"));
        return;
      }
      dispatch(userActions.getMyNftRequest());
      toast.success(
        t("marketplace.modalUpgradeYourPackage.Renew successfully")
      );
    }, 500);
  }, [dispatch, t]);

  const renewalAutoUpdateOptionChangeHandler = (
    renewOption: EUpgradeNFTType
  ) => {
    setRenewOption(renewOption);
    updateRenewHandler(renewOption);
  };

  return (
    <HPModal
      open={open}
      width={816}
      title={null}
      footer={null}
      className={styles["auto-renew-modal"]}
      closeIcon={<CloseOutlined />}
      onClose={onClose}
    >
      <div className={styles["auto-renew-modal__content-container"]}>
        <img
          src={ImageNFT}
          alt=""
          width={280}
          className={styles["auto-renew-modal__nft-img"]}
        />
        <div className={styles.nftInfo} style={{ height: "100%" }}>
          <h4 className={styles["auto-renew-modal__nft-name"]}>Premium NFT</h4>
          <span className={styles.nftInfoUser}>ID: {myNFT?.customId}</span>
          <span className={styles.nftInfoUser}>
            {t("marketplace.NFTItem.textOwner")}: {user?.name}
          </span>
          {nftExpireTime && (
            <span className={styles.nftInfoUser}>
              {t("marketplace.NFTItem.textExpirationDate")}:{" "}
              {dayjs(nftExpireTime).format(EFormatDate["DD/MM/YYYY"])}
            </span>
          )}
          <span className={styles.nftInfoUser}>
            {t("marketplace.NFTItem.textCreatedAt")}:{" "}
            {dayjs(myNFT?.buyNftAt).format(EFormatDate["DD/MM/YYYY"])}
          </span>
          <Divider />
          <div className={styles["auto-renew-modal__nft-boxBottom"]}>
            <div>
              <p className={styles["auto-renew-modal__nft-package"]}>
                <span>{t("marketplace.modalAutoRenewal.textPackage")}</span>
                <span className={styles["highlight"]}>
                  {myNFT?.vipExpiredAt ? " VIP" : " Normal"}
                </span>
                {isExpireNFT && (
                  <span className={styles["expired"]}>
                    {t("marketplace.modalAutoRenewal.Expired")}
                  </span>
                )}
              </p>
              {!myNFT?.vipExpiredAt ? (
                <div className={styles["auto-renew-modal__upgrade"]}>
                  {t("marketplace.modalAutoRenewal.textUpgradePackage")} $
                  {pricesNFT.find(
                    (el) => el.key === EKeyPriceNFT.upgrade_nft_price
                  )?.value ?? 0}{" "}
                  <span onClick={onClickUpgrade}>
                    {t("marketplace.modalAutoRenewal.btnUpgrade")}
                  </span>
                </div>
              ) : (
                <>
                  <p className={styles["auto-renew-modal__expire-time"]}>
                    {t("marketplace.modalAutoRenewal.textExpired")}{" "}
                    {dayjs(myNFT?.vipExpiredAt).format(
                      EFormatDate["DD/MM/YYYY"]
                    )}
                    {/* {myNFT?.vipExpiredAt && !isReactivable && ( */}
                    <span
                      className={styles["renewalPrior"]}
                      onClick={onClickUpgrade}
                    >
                      {t("marketplace.modalAutoRenewal.textRenewalPrior")}
                    </span>
                    {/* )} */}
                  </p>
                  {/* <div className={styles["auto-renew-modal__action"]}>
                    <p>{t("marketplace.modalAutoRenewal.textAutoRenewal")}</p>
                    <Switch
                      checked={myNFT.autoRenew}
                      onChange={handleSwitchRenewal}
                    />
                  </div> */}
                </>
              )}
            </div>
            {isReactivable && (
              <Button className="ant-btn-custom" onClick={onClickUpgrade}>
                {t("marketplace.modalAutoRenewal.btnReActive")}
              </Button>
            )}
          </div>
          <div className={styles["auto-renew-modal__renew-option"]}>
            <p>{t("marketplace.modalUpgradeYourPackage.autoRenew")}</p>

            <Radio.Group
              value={renewOption}
              options={[
                {
                  label: t(
                    "marketplace.modalUpgradeYourPackage.No upgrade nor renew"
                  ),
                  value: EUpgradeNFTType.NO_OPTION,
                },
                {
                  label: t("marketplace.modalUpgradeYourPackage.Renew only"),
                  value: EUpgradeNFTType.RENEW_ONLY,
                },
                {
                  label: t("marketplace.modalUpgradeYourPackage.Upgrade only"),
                  value: EUpgradeNFTType.UPGRADE_ONLY,
                },
                {
                  label: t(
                    "marketplace.modalUpgradeYourPackage.Both renew and upgrade"
                  ),
                  value: EUpgradeNFTType.BOTH_UPGRADE,
                },
              ]}
              onChange={(event) => {
                renewalAutoUpdateOptionChangeHandler(
                  event.target.value as EUpgradeNFTType
                );
              }}
            />
          </div>
        </div>
      </div>
    </HPModal>
  );
}

export default ModalAutoRenewal;

import { useAppSelector } from "@/app/hooks";
import store from "@/app/store";
import HPModal from "@/components/common/HPModal";
import { userActions } from "@/features/user/userSlice";
import { EKeyPriceNFT, IPriceNFT } from "@/interfaces/marketplace";
import { EPackageType, marketServices } from "@/service/marketplaceService";
import { Radio, Switch } from "antd";
import classNames from "classnames";
import { TFunction } from "i18next";
import _ from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styles from "./style.module.scss";
import { CloseOutlined } from "@ant-design/icons";

type Props = {
  open: boolean;
  onClose: () => void;
};

const getNFTOptionPrices = (t: TFunction<"translation", undefined>) => {
  return [
    {
      value: EPackageType.by_month,
      title: t("marketplace.modalUpgradeYourPackage.option1.title"),
      type: t("marketplace.modalUpgradeYourPackage.option1.type"),
      event: t("marketplace.modalUpgradeYourPackage.option1.eventType"),
      key: EKeyPriceNFT.nft_price,
    },
    {
      value: EPackageType.by_6months,
      title: t("marketplace.modalUpgradeYourPackage.option3.title"),
      type: t("marketplace.modalUpgradeYourPackage.option3.type"),
      event: t("marketplace.modalUpgradeYourPackage.option3.eventType"),
      key: EKeyPriceNFT.nft_price_by_six_month,
    },
    {
      value: EPackageType.by_year,
      title: t("marketplace.modalUpgradeYourPackage.option2.title"),
      type: t("marketplace.modalUpgradeYourPackage.option2.type"),
      event: t("marketplace.modalUpgradeYourPackage.option2.eventType"),
      key: EKeyPriceNFT.nft_price_by_year,
    },
    {
      value: EPackageType.by_month,
      title: t("marketplace.modalUpgradeYourPackage.option1.title"),
      type: t("marketplace.modalUpgradeYourPackage.option1.type"),
      event: t("marketplace.modalUpgradeYourPackage.option1.eventType"),
      key: EKeyPriceNFT.upgrade_nft_price,
    },
    {
      value: EPackageType.by_6months,
      title: t("marketplace.modalUpgradeYourPackage.option3.title"),
      type: t("marketplace.modalUpgradeYourPackage.option3.type"),
      event: t("marketplace.modalUpgradeYourPackage.option3.eventType"),
      key: EKeyPriceNFT.upgrade_nft_price_by_six_month,
    },
    {
      value: EPackageType.by_year,
      title: t("marketplace.modalUpgradeYourPackage.option2.title"),
      type: t("marketplace.modalUpgradeYourPackage.option2.type"),
      event: t("marketplace.modalUpgradeYourPackage.option2.eventType"),
      key: EKeyPriceNFT.upgrade_nft_price_by_year,
    },
  ];
};

const optionsNFTPrices = (
  t: TFunction<"translation", undefined>,
  pricesNFT: IPriceNFT[]
) => {
  const nftPricingList = getNFTOptionPrices(t);

  return _.intersectionBy(nftPricingList, pricesNFT, "key").map((pricing) => ({
    ...pricing,
    fee: pricesNFT.find((el) => el.key === pricing.key)?.value ?? 0,
  }));
};

export default function ModalUpgradeYourPackage({ open, onClose }: Props) {
  const { t } = useTranslation();
  const pricesNFT = useAppSelector((state) => state.marketplace.pricesNFT);
  const [isOnVipOption, setIsOnVipOption] = useState(false);
  const nftPriceList = pricesNFT.filter((priceOption) =>
    priceOption.key.startsWith(isOnVipOption ? "upgrade_" : "nft_")
  );

  const pricingOptions = optionsNFTPrices(t, nftPriceList);

  const userBalance = useAppSelector((state) => state.user.user?.balance) || 0;
  const [packageType, setPackageType] = useState<EPackageType | null>(() => {
    const defaultNFT = pricingOptions.find(
      (nft) => nft.value === EPackageType.by_month
    );

    if (!defaultNFT || Number(defaultNFT.fee) > userBalance) {
      return null;
    }

    return EPackageType.by_month;
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { myNFT } = useAppSelector((state) => state.user);

  const handleUpgradePackage = async () => {
    if (!packageType) {
      return;
    }

    setIsProcessing(true);
    let _res, error: any;

    if (!isOnVipOption) {
      [_res, error] = await marketServices.renewNFT({
        package_type: packageType,
        autoRenew: myNFT?.autoRenew,
      });
    } else {
      [_res, error] = await marketServices.upgradeNFT({
        package_type: packageType,
        autoRenew: myNFT?.autoRenew,
      });
    }

    if (error) {
      setIsProcessing(false);
      console.log({ error });
      toast.error(_.capitalize(error?.data?.message[0]));
    } else {
      setIsProcessing(false);
      store.dispatch(userActions.getMyNftRequest());
      onClose();
      toast.success(
        myNFT?.boughtNft
          ? t("marketplace.NFTItem.textRenewalSuccessfully")
          : t("marketplace.NFTItem.textUpgradeSuccessfully")
      );
    }
  };

  const nftPackageSelectOption = (
    option: ReturnType<typeof optionsNFTPrices>[0]
  ) => {
    const optionFee = Number(option.fee) || 0;
    if (optionFee > userBalance) {
      return;
    }

    setPackageType(option.value);
  };

  return (
    <HPModal
      open={open}
      onClose={onClose}
      closeIcon={<CloseOutlined />}
      className={styles.modalUpgradePackage}
      textCustomBtnConfirm={t("marketplace.modalUpgradeYourPackage.btnOk")}
      textCustomBtnCancel={t("marketplace.modalUpgradeYourPackage.btnCancel")}
      onOK={handleUpgradePackage}
      loading={isProcessing}
      width={900}
    >
      <div className={styles.modalUpgradePackage}>
        <h3>
          {myNFT?.boughtNft
            ? t("marketplace.modalUpgradeYourPackage.title2")
            : t("marketplace.modalUpgradeYourPackage.title")}
        </h3>
        {pricesNFT.length > 1 && (
          <div className={styles["modalUpgradePackage__upgrade-switch"]}>
            <span>VIP NFT</span>
            <Switch
              checked={isOnVipOption}
              onChange={(isOn) => {
                setIsOnVipOption(isOn);
              }}
            />
          </div>
        )}
        <div className={styles.modalUpgradePackage__options}>
          {optionsNFTPrices(t, nftPriceList).map((opt, index) => {
            const selected = packageType === opt.value;
            const isSelectable = Number(opt.fee) <= userBalance;

            return (
              <div
                key={opt.value}
                className={classNames(styles.opt, {
                  [styles.optSelected]: selected,
                  [styles.disabled]: !isSelectable,
                })}
                onClick={() => nftPackageSelectOption(opt)}
              >
                <div className={styles.opt__title}>
                  <span>{opt.title}</span>
                  <Radio checked={selected} disabled={!isSelectable} />
                </div>
                <div>
                  <span className={styles.opt__number}>${opt.fee}</span>/
                  <span className={styles.opt__type}>{opt.type}</span>
                </div>
                <span className={styles.opt__eventType}>{opt.event}</span>
              </div>
            );
          })}
        </div>
      </div>
    </HPModal>
  );
}

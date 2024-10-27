import { REGEX_WALLET_ADDRESS } from "@/app/regex";
import store from "@/app/store";
import HPModal from "@/components/common/HPModal";
import { userActions } from "@/features/user/userSlice";
import { EPackageType, marketServices } from "@/service/marketplaceService";
import { Button, Form, Input, Radio, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import style from "./style.module.scss";
import _ from "lodash";
import classNames from "classnames";
import { useAppSelector } from "@/app/hooks";
import { useState } from "react";
import { EKeyPriceNFT, IPriceNFT } from "@/interfaces/marketplace";
import { TFunction } from "i18next";
import { CloseOutlined } from "@ant-design/icons";

type Props = {
  open: boolean;
  onClose: () => void;
  isProcessingBuyNFT: boolean;
  setIsProcessingBuyNFT: (value: boolean) => void;
};

interface ICommentForm {
  address: string;
}

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

export default function ModalCheckoutNFT({
  open,
  onClose,
  isProcessingBuyNFT,
  setIsProcessingBuyNFT,
}: Props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [packageType, setPackageType] = useState<EPackageType>(
    EPackageType.by_month
  );
  const { pricesNFT } = useAppSelector((state) => state.marketplace);

  const [isOnVipOption, setIsOnVipOption] = useState(false);
  const hasBuyNFT = !!useAppSelector((state) => state.user.myNFT);

  const nftPriceList = pricesNFT.filter((priceOption) =>
    priceOption.key.startsWith(isOnVipOption ? "upgrade_" : "nft_")
  );

  const onFinish = async (formData: ICommentForm) => {
    setIsProcessingBuyNFT(true);

    let res, error: any;
    if (isOnVipOption) {
      [res, error] = await marketServices.upgradeNFT({
        walletAddress: formData.address,
        package_type: packageType,
        // autoRenew: false,
      });
    } else if (!hasBuyNFT) {
      [res, error] = await marketServices.buyNFT({
        walletAddress: formData.address,
        package_type: packageType,
      });
    } else {
      [res, error] = await marketServices.renewNFT({
        walletAddress: formData.address,
        package_type: packageType,
        // autoRenew: false,
      });
    }

    if (res) {
      setIsProcessingBuyNFT(false);
      store.dispatch(userActions.getMyNftRequest());
      onClose();
      toast.info(t("marketplace.NFTItem.textProcessingBuyNFT"));
    } else {
      setIsProcessingBuyNFT(false);
      toast.error(_.capitalize((error as any)?.data?.message));
    }
  };

  const handlePackageTypeChange = (value: EPackageType) => {
    setPackageType(value);
  };

  return (
    <HPModal
      open={open}
      onClose={onClose}
      footer={null}
      className={style["checkout-modal"]}
      closeIcon={<CloseOutlined />}
      title={t("marketplace.modalCheckoutNFT.title")}
      width={900}
    >
      <div className={style.form}>
        <div className={style.title}>
          {t("marketplace.modalCheckoutNFT.content")}
        </div>
        {pricesNFT.length > 1 && (
          <div className={style["form__switch"]}>
            <span>VIP NFT</span>
            <Switch
              checked={isOnVipOption}
              onChange={(isOn) => {
                setIsOnVipOption(isOn);
              }}
            />
          </div>
        )}
        <Form<ICommentForm>
          form={form}
          name="checkoutNFT"
          onFinish={onFinish}
          scrollToFirstError
          layout={"vertical"}
        >
          <Form.Item>
            <div className={style.form__options}>
              {optionsNFTPrices(t, nftPriceList).map((opt) => {
                const selected = packageType === opt.value;
                return (
                  <div
                    key={opt.key}
                    className={classNames(
                      style.opt,
                      selected ? style.optSelected : ""
                    )}
                    onClick={() => handlePackageTypeChange(opt.value)}
                  >
                    <div className={style.opt__title}>
                      <span>{opt.title}</span>
                      <Radio
                        checked={selected}
                        onClick={() => handlePackageTypeChange(opt.value)}
                      />
                    </div>
                    <div>
                      <span className={style.opt__number}>${opt.fee}</span>/
                      <span className={style.opt__type}>{opt.type}</span>
                    </div>
                    <span className={style.opt__eventType}>{opt.event}</span>
                  </div>
                );
              })}
            </div>
          </Form.Item>
          <Form.Item<ICommentForm>
            name="address"
            normalize={(value) => value.trim()}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error(t("dashboardUser.withdrawal.requireAddress"))
                    );
                  }

                  return !new RegExp(REGEX_WALLET_ADDRESS).test(value)
                    ? Promise.reject(
                        new Error(t("dashboardUser.withdrawal.validateAddress"))
                      )
                    : Promise.resolve();
                },
              },
            ]}
            label={t("marketplace.modalCheckoutNFT.labelInput")}
          >
            <Input
              placeholder={t("marketplace.modalCheckoutNFT.placeholderInput")}
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="ant-btn-custom"
              htmlType="submit"
              loading={isProcessingBuyNFT}
              disabled={isProcessingBuyNFT}
            >
              {t("marketplace.modalCheckoutNFT.btnConfirm")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </HPModal>
  );
}

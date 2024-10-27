import { useEffect, useState } from "react";
import ModalAutoRenewal from "./ModalAutoRenewal";
import style from "./style.module.scss";
import NFTItem from "./NFTItem";
import ModalCheckoutNFT from "./ModalCheckoutNFT";
import ModalUpgradeYourPackage from "./ModalUpgradeYourPackage";
import { useAppSelector } from "@/app/hooks";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Marquee from "react-fast-marquee";
import store from "@/app/store";
import { marketplaceAction } from "@/features/marketplace/marketplaceSlice";
import { userActions } from "@/features/user/userSlice";
import { EKeyPriceNFT } from "@/interfaces/marketplace";
import CardAnimation from "./CardAnimation";

export default function Marketplace() {
  const [isShowAutoRenewalModal, setIsShowAutoRenewalModal] = useState(false);
  const [isShowModalCheckout, setIsShowModalCheckout] = useState(false);
  const [isShowModalUpgrade, setIsShowModalUpgrade] = useState(false);
  const [isProcessingBuyNFT, setIsProcessingBuyNFT] = useState(false);

  const { t } = useTranslation();
  const { myNFT, user } = useAppSelector((state) => state.user);
  const { pricesNFT } = useAppSelector((state) => state.marketplace);

  const priceNFT =
    pricesNFT.find((el) => el.key === EKeyPriceNFT.nft_price)?.value ?? 0;

  const handleClickBuy = () => {
    if (myNFT?.buyNftStatus) {
      setIsShowAutoRenewalModal(true);
    } else if (Number(user?.balance) < Number(priceNFT)) {
      toast.error(t("marketplace.NFTItem.Not enought balance"));
    } else {
      setIsShowModalCheckout(true);
    }
  };

  useEffect(() => {
    store.dispatch(marketplaceAction.getNFTPricesRequest());
    store.dispatch(userActions.getMyNftRequest());
  }, []);

  return (
    <>
      <div className={style.marketplace}>
        <h3>{t("marketplace.Premium NFTs")}</h3>
        <div className={style.boxNFT}>
          <Marquee speed={80} pauseOnHover>
            <span className={style["marketplace__marquee-text"]}>
              {t("marketplace.marguee text")}
            </span>
          </Marquee>
          <CardAnimation>
            <NFTItem
              onClickBuy={handleClickBuy}
              textBtn={t("marketplace.NFTItem.btnBuy")}
            />
          </CardAnimation>
        </div>
      </div>
      {isShowModalCheckout && (
        <ModalCheckoutNFT
          open={isShowModalCheckout}
          onClose={() => setIsShowModalCheckout(false)}
          setIsProcessingBuyNFT={setIsProcessingBuyNFT}
          isProcessingBuyNFT={isProcessingBuyNFT}
        />
      )}
      {isShowAutoRenewalModal && (
        <ModalAutoRenewal
          open={isShowAutoRenewalModal}
          onClose={() => setIsShowAutoRenewalModal(false)}
          onClickUpgrade={() => setIsShowModalUpgrade(true)}
        />
      )}
      {isShowModalUpgrade && (
        <ModalUpgradeYourPackage
          open={isShowModalUpgrade}
          onClose={() => setIsShowModalUpgrade(false)}
        />
      )}
    </>
  );
}

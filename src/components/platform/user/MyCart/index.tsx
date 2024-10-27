import { useMemo } from "react";
import style from "./style.module.scss";
import CategoryHeroImage from "../../product/shared/HeroImage";
import { ERoutePath } from "../../../../app/constants/path";
import UserLayout from "../../../layouts/UserLayout";
import { useTranslation } from "react-i18next";
import CartCheckout from "./components/CartCheckout";
import { IBreadcrumb } from "@/interfaces/common";
import { useNavigate } from "react-router-dom";

export default function MyCartPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const categories = useMemo(() => {
    const breadcrumbsList: IBreadcrumb[] = [
      { label: t("home"), link: ERoutePath.HOME, isActive: false },
      {
        label: t("cart.Shopping Cart"),
        link: ERoutePath.MY_CART,
        isActive: true,
      },
    ];

    return breadcrumbsList;
  }, [t]);

  function proceedToPaymentStep() {
    navigate(ERoutePath.CART_CHECKOUT);
  }

  return (
    <UserLayout>
      <CategoryHeroImage
        categories={categories}
        title={t("cart.Shopping Cart")}
      />
      <div className={style.cartPage}>
        <CartCheckout onCheckout={proceedToPaymentStep} />
      </div>
    </UserLayout>
  );
}

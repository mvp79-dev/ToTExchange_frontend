import { ERoutePath } from "@/app/constants/path";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import UserLayout from "@/components/layouts/UserLayout";
import { cartAction } from "@/features/cart/cartSlice";
import { userActions } from "@/features/user/userSlice";
import { orderAdapter } from "@/helpers/adapters/OrderAdapter";
import { shippingAddressAdapter } from "@/helpers/adapters/ShippingAdapter";
import { ICheckoutCardForm } from "@/interfaces/cart";
import { IBreadcrumb } from "@/interfaces/common";
import { IShippingAddressForm } from "@/interfaces/shippingAddress";
import { orderServices } from "@/service/orderServices";
import { shippingAddressServices } from "@/service/shippingAddressServices";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CategoryHeroImage from "../../product/shared/HeroImage";
import CartPayment from "./CartPayment";
import OrderSuccessModal from "./OrderSuccessModal";
import ShippingAddressListModal from "./ShippingAddressList";
import ModalAddShippingAddress from "../Modal/ModalAddShippingAddress";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import styles from "./style.module.scss";

function CartCheckoutPage() {
  const { t } = useTranslation();
  const orderList = useAppSelector((state) => state.cart.carts);
  const shippingAddressList = useAppSelector(
    (state) => state.user.shippingAddress
  );

  const [isSuccessOrdered, setIsSuccessOrdered] = useState(false);
  const [isChangeShippingAddress, setIsChangeShippingAddress] = useState(false);
  const [isConfirmPayment, setIsConfirmPayment] = useState(false);
  const [editingShippingAddress, setEditingShippingAddress] = useState<
    undefined | number
  >(undefined);
  const [successOrderId, setSuccessOrderId] = useState<number>(NaN);
  const [deliveryAddress, setDeliveryAddress] = useState<number>(() => {
    return (
      shippingAddressList.find((address) => address.isDefault)?.id ??
      shippingAddressList[0]?.id ??
      NaN
    );
  });

  const dispatch = useAppDispatch();

  const categories = useMemo(() => {
    const breadcrumbsList: IBreadcrumb[] = [
      { label: t("home"), link: ERoutePath.HOME, isActive: false },
      {
        label: t("cart.Shopping Cart"),
        link: ERoutePath.MY_CART,
        isActive: false,
      },
      {
        label: t("cart.Checkout"),
        link: ERoutePath.CART_CHECKOUT,
        isActive: true,
      },
    ];

    return breadcrumbsList;
  }, [t]);

  function proceedToPaymentHandler(bankCardForm?: ICheckoutCardForm) {
    setIsConfirmPayment(true);
  }

  function editShippingAddressHandler(shippingAddressId?: number) {
    setEditingShippingAddress(shippingAddressId ?? 0);
  }

  function changeShippingAddressHandler(shipAddressId: number) {
    setIsChangeShippingAddress(false);
    setDeliveryAddress(shipAddressId);
  }

  async function addShippingAddressHandler(form: IShippingAddressForm) {
    try {
      const sendData =
        shippingAddressAdapter.convertShippingFormToEditFormRequest(form);

      let response, error;

      if (form.id) {
        [response, error] = await shippingAddressServices.editShippingAddress(
          form.id,
          sendData
        );

        if (response) {
          dispatch(userActions.getUserShippingRequest());
          toast.success(t("cart.Edit shipping Address success"));
        }
      } else {
        [response, error] = await shippingAddressServices.addShippingAddress(
          sendData
        );

        if (response) {
          dispatch(userActions.getUserShippingRequest());
          toast.success(t("cart.Add shipping Address success"));
        }
      }

      if (error) {
        toast.error(error?.data?.message);
        return;
      }
    } catch (error) {
      toast.error("Add shipping address error: ");
    } finally {
      setEditingShippingAddress(undefined);
    }
  }

  async function createOrderHandler() {
    if (shippingAddressList.length === 0) {
      toast.error(t("cart.empty shipping address"));

      return;
    }

    try {
      const [response, error] = await orderServices.orderProduct({
        cardItemIds:
          orderAdapter.convertCartItemsListToCreateCartRequest(orderList),
        shippingAddressId: deliveryAddress,
      });
      if (error) {
        if ((error as any).status >= 500) {
          return;
        }

        toast.error((error as any).data?.message);
        return;
      }

      setIsSuccessOrdered(true);
      // @ts-expect-error
      setSuccessOrderId(response.data.id);
      dispatch(cartAction.getCartInfoRequest());
      dispatch(userActions.getUserInfoRequest());
    } catch (error) {
      return;
    } finally {
      setIsConfirmPayment(false);
    }
  }

  useEffect(() => {
    if (shippingAddressList.length && Number.isNaN(deliveryAddress)) {
      setDeliveryAddress(
        shippingAddressList.find((address) => address.isDefault)?.id ??
          (shippingAddressList[0]?.id as number)
      );
    }
  }, [deliveryAddress, shippingAddressList]);

  return (
    <UserLayout>
      <CategoryHeroImage
        categories={categories}
        title={t("cart.Shopping Cart")}
      />
      <div className={styles["checkout-page"]}>
        <CartPayment
          selectedShipAddress={deliveryAddress}
          onChangeShippingAddress={() => setIsChangeShippingAddress(true)}
          onSubmitPayment={proceedToPaymentHandler}
        />
      </div>
      <OrderSuccessModal
        successOrder={successOrderId}
        open={isSuccessOrdered}
        onClose={() => {
          setIsSuccessOrdered(false);
        }}
      />
      <ShippingAddressListModal
        deliveryAddress={deliveryAddress}
        open={isChangeShippingAddress}
        onEditAddress={editShippingAddressHandler}
        onConfirmShippingAddress={changeShippingAddressHandler}
        onClose={() => {
          setIsChangeShippingAddress(false);
        }}
      />
      <ModalAddShippingAddress
        editingAddressId={editingShippingAddress}
        open={editingShippingAddress !== undefined}
        onClose={() => {
          setEditingShippingAddress(undefined);
        }}
        onSubmit={addShippingAddressHandler}
      />
      <ConfirmPaymentModal
        open={isConfirmPayment}
        onClose={() => {
          setIsConfirmPayment(false);
        }}
        onConfirm={createOrderHandler}
      />
    </UserLayout>
  );
}

export default CartCheckoutPage;

import { useAppSelector } from "@/app/hooks";
import { shippingAddressAdapter } from "@/helpers/adapters/ShippingAdapter";
import { IShippingAddressForm } from "@/interfaces/shippingAddress";
import { shippingAddressServices } from "@/service/shippingAddressServices";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Radio } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ModalAddShippingAddress from "../../../Modal/ModalAddShippingAddress";
import style from "./style.module.scss";
import store from "@/app/store";
import { userActions } from "@/features/user/userSlice";
import ModalConfirmChooseAddressDefault from "../../../Modal/ModalConfirmChooseAddressDefault";

export default function InfoAddress() {
  const { t } = useTranslation();

  const { shippingAddress } = useAppSelector((state) => state.user);
  const [chooseAddress, setChooseAddress] = useState<IShippingAddressForm>();
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);

  const [editingShippingAddress, setEditingShippingAddress] =
    useState<number>();

  const [isOpenModalShipping, setIsOpenModalShipping] =
    useState<boolean>(false);

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
          store.dispatch(userActions.getUserShippingRequest());
          setIsOpenModalShipping(false);
          toast.success(t("cart.Edit shipping Address success"));
        }
      } else {
        [response, error] = await shippingAddressServices.addShippingAddress(
          sendData
        );
        if (response) {
          store.dispatch(userActions.getUserShippingRequest());
          setIsOpenModalShipping(false);
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

  const handleChooseDefaultAddress = async () => {
    if (!chooseAddress?.id) return;
    const sendData =
      shippingAddressAdapter.convertShippingFormToEditFormRequest({
        ...chooseAddress,
        isDefault: true,
      });
    const [response, error] = await shippingAddressServices.editShippingAddress(
      chooseAddress.id,
      sendData
    );
    if (response) {
      store.dispatch(userActions.getUserShippingRequest());
      setOpenModalConfirm(false);
      toast.success(t("profile.messageUpdateDefaultAddress"));
    } else {
      toast.error(error?.data?.message);
      return;
    }
  };

  return (
    <div>
      <div className={style.infoUserOther}>
        <div className={style.infoUserOther__address}>
          <div className={style.infoUserOther__address__item}>
            <div className={style.infoUserOther__address__label}>
              <span>{t("profile.textShippingAddress")}</span>
            </div>
            <div className={style.boxAddress}>
              {shippingAddress.map((el, index) => (
                <div
                  key={index}
                  className={classNames(
                    style.boxAddressItem,
                    el.isDefault && style.boxAddressActive
                  )}
                >
                  <div className={style.boxAddressItem__header}>
                    <div className={style.boxAddressItem__header__check}>
                      <Radio
                        onChange={() => {
                          setOpenModalConfirm(true);
                          setChooseAddress(el);
                        }}
                        checked={el.isDefault}
                      >
                        <span>
                          {el.receiverName} | +84{" "}
                          {el.receiverPhone.substring(1)}
                        </span>
                      </Radio>
                    </div>
                    <div
                      className={style.boxAddressItem__header__edit}
                      onClick={() => {
                        setEditingShippingAddress(el.id);
                        setIsOpenModalShipping(true);
                      }}
                    >
                      <EditOutlined />
                      <span>{t("profile.btnEdit")}</span>
                    </div>
                  </div>
                  <div className={style.boxAddressItem__address}>
                    {el.street}
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                setEditingShippingAddress(undefined);
                setIsOpenModalShipping(true);
              }}
              icon={<PlusOutlined />}
            >
              {t("cart.Add more")}
            </Button>
          </div>
          {/* <div className={style.infoUserOther__address__item}>
            <div className={style.infoUserOther__address__label}>
              <span>{t("profile.textBillingAddress")}</span>
           
            </div>
            <div className={style.infoUserOther__address__value}>
              Suite 2607_26/F Tower 1The Gateway Harbour CityTsimshatsui, KC
              HONG KONG
            </div>
          </div> */}
        </div>
      </div>
      {isOpenModalShipping && (
        <ModalAddShippingAddress
          open={isOpenModalShipping}
          onClose={() => setIsOpenModalShipping(false)}
          editingAddressId={editingShippingAddress}
          onSubmit={addShippingAddressHandler}
        />
      )}

      {openModalConfirm && chooseAddress && (
        <ModalConfirmChooseAddressDefault
          open={openModalConfirm}
          onClose={() => setOpenModalConfirm(false)}
          infoAddress={chooseAddress}
          onOK={handleChooseDefaultAddress}
        />
      )}
      {/* <ModalEditBillingAddress open={true} onClose={() => {}} /> */}
    </div>
  );
}

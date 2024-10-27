import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";

import HPModal from "@/components/common/HPModal";
import styles from "./styles.module.scss";
import { Button, Radio } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { useAppSelector } from "@/app/hooks";
import { shippingAddressAdapter } from "@/helpers/adapters/ShippingAdapter";

interface IProps {
  open: boolean;
  deliveryAddress: number;
  onClose: () => void;
  onEditAddress: (addressId?: number) => void;
  onConfirmShippingAddress: (addressId: number) => void;
}

function ShippingAddressList({
  open,
  deliveryAddress,
  onClose,
  onEditAddress,
  onConfirmShippingAddress,
}: IProps) {
  const { t } = useTranslation();

  const shippingAddressList = useAppSelector(
    (state) => state.user.shippingAddress
  );

  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<number>(deliveryAddress);

  const deliveriesList = useMemo(() => {
    return shippingAddressList.map((address) => ({
      id: address.id,
      name: address.receiverName,
      phoneNumber: address.receiverPhone,
      address: shippingAddressAdapter.getFullShippingAddress(address),
    }));
  }, [shippingAddressList]);

  useEffect(() => {
    if (!open && selectedShippingAddress !== deliveryAddress) {
      setSelectedShippingAddress(deliveryAddress);
    }
  }, [deliveryAddress, open, selectedShippingAddress]);

  return (
    <HPModal
      open={open}
      className={styles["shipping-modal"]}
      title={
        <h5 className={styles["shipping-modal__title"]}>
          {t("cart.Change Shipping Addess")}
        </h5>
      }
      width={786}
      textCustomBtnConfirm={t("cart.Save")}
      onClose={onClose}
      onOK={() => onConfirmShippingAddress(selectedShippingAddress)}
    >
      <div>
        <ul className={styles["shipping-modal__address-list"]}>
          {deliveriesList.map((address) => (
            <li
              key={address.id}
              className={classNames({
                [styles["active"]]: address.id === selectedShippingAddress,
              })}
            >
              <div
                className={styles["shipping-modal__address-list__item__title"]}
              >
                <Radio
                  className={
                    styles["shipping-modal__address-list__item__title__contact"]
                  }
                  checked={address.id === selectedShippingAddress}
                  onChange={() =>
                    setSelectedShippingAddress(address.id as number)
                  }
                >
                  {address.name} | {address.phoneNumber}
                </Radio>
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  className={
                    styles[
                      "shipping-modal__address-list__item__title__edit-btn"
                    ]
                  }
                  onClick={() => onEditAddress(address.id)}
                >
                  {t("cart.Edit")}
                </Button>
              </div>
              <p>{address.address}</p>
            </li>
          ))}
        </ul>
        <Button
          icon={<PlusOutlined />}
          className={styles["shipping-modal__add-address"]}
          onClick={() => onEditAddress()}
        >
          {t("cart.Add more")}
        </Button>
      </div>
    </HPModal>
  );
}

export default ShippingAddressList;

import { Button } from "antd";
import { Trans, useTranslation } from "react-i18next";
import HPModal from "@/components/common/HPModal";
import { ReactComponent as OrderSuccessImg } from "@/assets/images/order-success.svg";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";

interface IProps {
  open: boolean;
  successOrder: number;
  onClose: () => void;
}

function OrderSuccessModal({ onClose, open, successOrder }: IProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function goBackHome() {
    navigate(ERoutePath.HOME);
  }

  function goToOrderDetail() {
    navigate({
      pathname: ERoutePath.MY_ORDER,
      search: `orderId=${successOrder}`,
    });
  }

  return (
    <HPModal
      open={open}
      onClose={onClose}
      footer={null}
      className={styles["order-modal"]}
      width={524}
    >
      <div className={styles["order-modal__order-info"]}>
        <OrderSuccessImg
          className={styles["order-modal__order-info__success-icon"]}
        />
        <div className={styles["order-modal__order-info__info"]}>
          <h5 className={styles["order-modal__order-info__info__title"]}>
            {t("cart.Order Successful Placed")}
          </h5>
          <p className={styles["order-modal__order-info__info__description"]}>
            {t("cart.Thanks for your purchase")}!
          </p>
          <p className={styles["order-modal__order-info__info__description"]}>
            <Trans
              i18nKey="cart.Your_order_is"
              tOptions={{
                id: successOrder,
              }}
              components={{
                span: (
                  <span
                    className={
                      styles[
                        "order-modal__order-info__info__description--highlight"
                      ]
                    }
                  />
                ),
              }}
            />
          </p>
        </div>
        <div className={styles["order-modal__order-info__info__actions"]}>
          <Button onClick={goBackHome}>{t("home")}</Button>
          <Button onClick={goToOrderDetail}>{t("cart.Your Order")}</Button>
        </div>
      </div>
    </HPModal>
  );
}

export default OrderSuccessModal;

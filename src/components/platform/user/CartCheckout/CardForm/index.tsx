import * as React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { ICheckoutCardForm } from "@/interfaces/cart";

const CartForm = React.forwardRef<{ form: FormInstance<ICheckoutCardForm> }>(
  function CartForm(_props, ref) {
    const [form] = Form.useForm<ICheckoutCardForm>();
    const { t } = useTranslation();

    React.useImperativeHandle(
      ref,
      () => {
        return {
          form,
        };
      },
      [form]
    );

    return (
      <Form form={form} layout="vertical" className={styles["card-form"]}>
        <Form.Item
          name="holderName"
          label={t("cart.Cardholder Name")}
          rules={[{ required: true, message: t("cart.Your name is required") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cardNumber"
          label={t("cart.Card Number")}
          rules={[
            { required: true, message: t("cart.Please enter card number") },
          ]}
        >
          <Input placeholder={t("cart.Card Number Placeholder")} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="expirationTime"
              label={t("cart.Expiration Code")}
              rules={[
                {
                  required: true,
                  message: t("cart.Please enter expiration code"),
                },
              ]}
            >
              <Input placeholder="MM / YY" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="cvc"
              label={t("cart.Security Code")}
              rules={[
                {
                  required: true,
                  message: t("cart.Please enter CVC"),
                },
              ]}
            >
              <Input placeholder="CVC" suffix={<InfoCircleOutlined />} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
);

export default CartForm;

import { useEffect, useMemo } from "react";
import HPModal from "@/components/common/HPModal";
import { Col, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";

import style from "./style.module.scss";
import { IShippingAddressForm } from "@/interfaces/shippingAddress";
import { useAppSelector } from "@/app/hooks";
import { useMediaQuery } from "react-responsive";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";
import HPDrawer from "@/components/common/HPDrawer";
import HPButton from "@/components/common/Button";
import classNames from "classnames";

type IProps = {
  editingAddressId?: number;
  open: boolean;
  onClose: () => void;
  onSubmit: (form: IShippingAddressForm) => void;
};

export default function ModalAddShippingAddress({
  editingAddressId,
  open,
  onClose,
  onSubmit,
}: IProps) {
  const [form] = Form.useForm();
  const isMobileView = useMediaQuery({ maxWidth: EResponsiveBreakpoint.sm });

  const { t } = useTranslation();
  const shipAddressesList = useAppSelector(
    (state) => state.user.shippingAddress
  );

  const editingAddress = useMemo(() => {
    if (editingAddressId) {
      return shipAddressesList.find(
        (address) => address.id === editingAddressId
      );
    }

    return undefined;
  }, [editingAddressId, shipAddressesList]);

  async function formSubmitHandler() {
    try {
      const addressForm = await form.validateFields();
      onSubmit(addressForm);
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    if (!open) {
      form.resetFields();
    } else if (editingAddress && open) {
      form.setFieldsValue({ ...editingAddress });
    }
  }, [editingAddress, form, open]);
  const renderForm = () => {
    return (
      <Form<IShippingAddressForm>
        form={form}
        name="formShipping"
        onFinish={onSubmit}
        initialValues={{}}
        scrollToFirstError
        layout="vertical"
        className={style.formShipping}
      >
        {!!editingAddressId && (
          <Form.Item<IShippingAddressForm> hidden name="id">
            <Input />
          </Form.Item>
        )}

        <Row gutter={{ xs: 8, sm: 20 }}>
          <Col span={12} xs={24} md={12}>
            <Form.Item<IShippingAddressForm>
              name="receiverName"
              rules={[
                {
                  required: true,
                  message: t(
                    "modal.modalFormShipping.Please enter receiver name"
                  ),
                },
              ]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label={t("modal.modalFormShipping.inputReceiverName")}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12} xs={24} md={12}>
            <Form.Item<IShippingAddressForm>
              name="receiverPhone"
              rules={[
                {
                  required: true,
                  message: t(
                    "modal.modalFormShipping.Please enter receiver phone"
                  ),
                },
              ]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label={t("modal.modalFormShipping.inputReceiverPhone")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 20 }}>
          <Col span={24}>
            <Form.Item<IShippingAddressForm>
              name="street"
              rules={[
                {
                  required: true,
                  message: t(
                    "modal.modalFormShipping.Please enter receive street"
                  ),
                },
                {
                  max: 100,
                  message: t("modal.modalFormShipping.maxLength", {
                    number: 100,
                  }),
                },
              ]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label={t("modal.modalFormShipping.inputStreet")}
            >
              <Input />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
        <Form.Item<IShippingAddressForm>
          name="street_1"
          normalize={(value) => {
            return value === " " ? "" : value;
          }}
          label="&nbsp;"
        >
          <Input />
        </Form.Item>
      </Col> */}
        </Row>
        <Row gutter={{ xs: 8, sm: 20 }}>
          <Col span={12} xs={24} md={12}>
            <Form.Item<IShippingAddressForm>
              name="country"
              label={t("modal.modalFormShipping.inputCountry")}
              rules={[
                {
                  required: true,
                  message: "Please enter receive country",
                },
                {
                  max: 50,
                  message: t("modal.modalFormShipping.maxLength", {
                    number: 50,
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12} xs={24} md={12}>
            <Form.Item<IShippingAddressForm>
              name="postalCode"
              rules={[
                {
                  required: true,
                  message: t(
                    "modal.modalFormShipping.Please enter portal code"
                  ),
                },
                {
                  max: 10,
                  message: t("modal.modalFormShipping.maxLength", {
                    number: 10,
                  }),
                },
              ]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label={t("modal.modalFormShipping.inputPostalCode")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item<IShippingAddressForm>
              name="district"
              label={t("modal.modalFormShipping.inputDistrict")}
              rules={[
                {
                  required: true,
                  message: t(
                    "modal.modalFormShipping.Please enter receive district"
                  ),
                },
                {
                  max: 50,
                  message: t("modal.modalFormShipping.maxLength", {
                    number: 50,
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item<IShippingAddressForm>
              name="city"
              label={t("modal.modalFormShipping.inputCity")}
              rules={[
                {
                  required: true,
                  message: t(
                    "modal.modalFormShipping.Please enter receive city"
                  ),
                },
                {
                  max: 100,
                  message: t("modal.modalFormShipping.maxLength", {
                    number: 100,
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };
  if (isMobileView)
    return (
      <HPDrawer
        open={open}
        onClose={onClose}
        title={
          editingAddressId
            ? t("modal.modalFormShipping.titleEdit")
            : t("modal.modalFormShipping.titleAdd")
        }
      >
        <div className={style.drawerAddress}>
          {renderForm()}
          <div className={style.drawerAddress__groupBtn}>
            <HPButton
              title={t("myOrder.btn.cancel")}
              className={style.btn}
              wrapperClassName={style.wrapBtn}
              onClick={onClose}
            />
            <HPButton
              title={t("modal.modalFormShipping.Save")}
              className={classNames(style.btn, style.activeBtn)}
              wrapperClassName={style.wrapBtn}
              onClick={formSubmitHandler}
            />
          </div>
        </div>
      </HPDrawer>
    );
  return (
    <HPModal
      width={608}
      open={open}
      onClose={onClose}
      title={
        editingAddressId
          ? t("modal.modalFormShipping.titleEdit")
          : t("modal.modalFormShipping.titleAdd")
      }
      textCustomBtnConfirm={t("modal.modalFormShipping.Save")}
      className={style["update-shipping-modal"]}
      onOK={formSubmitHandler}
    >
      {renderForm()}
    </HPModal>
  );
}

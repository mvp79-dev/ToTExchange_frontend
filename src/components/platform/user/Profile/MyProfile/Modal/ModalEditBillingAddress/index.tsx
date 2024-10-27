import HPModal from "@/components/common/HPModal";
import { Checkbox, Col, Form, Input, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";
import HPSelect from "@/components/common/Inputs/HPSelect";

interface ICommentForm {
  street: string;
  streetOther: string;
  country: string;
  postalCode: string;
  district: string;
  city: string;
  checkbox: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ModalEditBillingAddress({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const onFinish = () => {};

  return (
    <HPModal
      width={"672"}
      open={open}
      onClose={onClose}
      title={t("modal.modalEditBillingAddress.title")}
      textCustomBtnConfirm={"Save"}
    >
      <Form<ICommentForm>
        form={form}
        name="fontEditBilling"
        onFinish={onFinish}
        initialValues={{}}
        style={{ width: 608 }}
        scrollToFirstError
        layout="vertical"
        className={style.formEditBilling}
      >
        <Row gutter={{ xs: 8, sm: 20 }}>
          <Col span={12}>
            <Form.Item<ICommentForm>
              name="street"
              rules={[]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label={t("modal.modalEditBillingAddress.inputStreet")}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<ICommentForm>
              name="streetOther"
              rules={[]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label="&nbsp;"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 20 }}>
          <Col span={12}>
            <Form.Item<ICommentForm>
              name="country"
              rules={[]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label={t("modal.modalEditBillingAddress.inputCountry")}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<ICommentForm>
              name="postalCode"
              rules={[]}
              normalize={(value) => value.trim()}
              label={t("modal.modalEditBillingAddress.inputPostalCode")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item<ICommentForm>
              name="district"
              label={t("modal.modalEditBillingAddress.inputDistrict")}
            >
              <HPSelect
                defaultValue={"Kowloon City District"}
                options={[
                  {
                    label: "Kowloon City District",
                    value: "Kowloon City District",
                  },
                ]}
                onChange={() => {}}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item<ICommentForm>
              name="city"
              label={t("modal.modalEditBillingAddress.inputCity")}
            >
              <HPSelect
                defaultValue={"Tsimshatsui"}
                options={[
                  {
                    label: "Tsimshatsui",
                    value: "Tsimshatsui",
                  },
                ]}
                onChange={() => {}}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item<ICommentForm> name="checkbox" rules={[]}>
              <Checkbox>
                {t("modal.modalEditBillingAddress.inputCheckbox")}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </HPModal>
  );
}

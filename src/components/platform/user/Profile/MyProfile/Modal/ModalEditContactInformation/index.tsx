import HPModal from "@/components/common/HPModal";
import HPSelect from "@/components/common/Inputs/HPSelect";
import { Button, Col, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { userActions, userSelect } from "@/features/user/userSlice";
import { REGEX_PHONE_NUMBER } from "@/app/regex";
import { userServices } from "@/service/userService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import HPDrawer from "@/components/common/HPDrawer";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";
import { useMediaQuery } from "react-responsive";

import style from "./style.module.scss";

export interface IContactInfoForm {
  email: string;
  phoneNumber: string;
  country: string;
  postalCode: string;
  work: string;
  fax: string;
  pager: string;
  other: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
};

const FormContainer: React.FC<{
  isMobile: boolean;
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isMobile, onClose, open, title, children }) => {
  if (isMobile) {
    return (
      <HPDrawer open={open} onClose={onClose} title={title}>
        {children}
      </HPDrawer>
    );
  }

  return (
    <HPModal
      width="560"
      open={open}
      onClose={onClose}
      title={title}
      footer={""}
    >
      {children}
    </HPModal>
  );
};

export default function ModalEditContactInformation({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useAppSelector(userSelect);
  const isMobileDevice = useMediaQuery({ maxWidth: EResponsiveBreakpoint.xs });

  const onFinish = async (formData: IContactInfoForm) => {
    const [res, error]: any[] = await userServices.updateContactInfo(formData);
    if (error) {
      toast.error(error?.data?.message);
    } else {
      dispatch(userActions.getUserInfoRequest());
      onClose();
      toast.success(t("modal.modalEditContactInformation.alertSuccess"));
    }
  };

  return (
    <FormContainer
      isMobile={isMobileDevice}
      open={open}
      onClose={onClose}
      title={t("modal.modalEditContactInformation.title")}
    >
      <Form<IContactInfoForm>
        form={form}
        name="fontEditBilling"
        onFinish={onFinish}
        initialValues={user}
        scrollToFirstError
        layout="vertical"
        className={style.formEditContract}
      >
        <Row gutter={{ xs: 8, sm: 20 }}>
          <Col xs={24} sm={12}>
            <Form.Item<IContactInfoForm>
              name="email"
              rules={[
                {
                  type: "email",
                  message: t(
                    "modal.modalEditContactInformation.errors.invalidEmail"
                  ),
                },
                {
                  required: true,
                  message: t(
                    "modal.modalEditContactInformation.errors.requiredEmail"
                  ),
                },
              ]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label={t("modal.modalEditContactInformation.inputEmail")}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<IContactInfoForm>
              name="phoneNumber"
              rules={[
                {
                  validator: (_, value) => {
                    return new RegExp(REGEX_PHONE_NUMBER).test(value)
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            t(
                              "modal.modalEditContactInformation.errors.invalidPhone"
                            )
                          )
                        );
                  },
                },
              ]}
              normalize={(value) => value.trim()}
              label={t("modal.modalEditContactInformation.inputPhoneNumber")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 20 }}>
          <Col xs={24} sm={12}>
            <Form.Item<IContactInfoForm>
              name="country"
              rules={[]}
              normalize={(value) => {
                return value === " " ? "" : value;
              }}
              label={t("modal.modalEditContactInformation.inputCountry")}
            >
              <HPSelect
                onChange={() => {}}
                options={[
                  {
                    label: "USA",
                    value: "usa",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<IContactInfoForm>
              name="postalCode"
              rules={[]}
              normalize={(value) => value.trim()}
              label={t("modal.modalEditContactInformation.inputPostalCode")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item<IContactInfoForm>
              name="work"
              label={t("modal.modalEditContactInformation.inputWork")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row>
          <Col span={24}>
            <Form.Item<IContactInfoForm>
              name="fax"
              label={t("modal.modalEditContactInformation.inputFax")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item<IContactInfoForm>
              name="pager"
              label={t("modal.modalEditContactInformation.inputPager")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row> */}
        <Row>
          <Col span={24}>
            <Form.Item<IContactInfoForm>
              name="other"
              label={t("modal.modalEditContactInformation.inputOther")}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className={style.groupBtn}>
              <Button onClick={onClose}>{t("myOrder.btn.cancel")}</Button>
              <Button type="primary" htmlType="submit">
                {t("modal.modalFormShipping.Save")}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
}

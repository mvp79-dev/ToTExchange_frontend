import HPModal from "@/components/common/HPModal";
import HPSelect from "@/components/common/Inputs/HPSelect";
import { Button, Checkbox, Col, DatePicker, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";
import { useAppSelector } from "@/app/hooks";
import { userServices } from "@/service/userService";
import { toast } from "react-toastify";
import store from "@/app/store";
import { userActions } from "@/features/user/userSlice";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { isWebsiteAddress } from "@/app/common/isWebsiteAddress";
import { useMediaQuery } from "react-responsive";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";
import HPDrawer from "@/components/common/HPDrawer";

interface ICommentForm {
  name: string;
  // lastName: string;
  company: string;
  personalWebsite: string;
  birthday: string;
  preferredName: string;
  preferredLanguage: string;
  replicatedSiteText: string;
  checkbox: boolean;
}

type Props = {
  onClose: () => void;
  open: boolean;
};

const FormContainer: React.FC<{
  isMobile: boolean;
  open: boolean;
  title: string;
  children: React.ReactNode;
  confirmText: string;
  cancelText: string;
  onClose: () => void;
  onFinish: () => void;
}> = ({
  isMobile,
  onClose,
  open,
  title,
  onFinish,
  children,
  cancelText,
  confirmText,
}) => {
  if (isMobile) {
    return (
      <HPDrawer open={open} onClose={onClose} title={title}>
        {children}
        <div className={style["formEditProfile__actions"]}>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button type="primary" onClick={onFinish}>
            {confirmText}
          </Button>
        </div>
      </HPDrawer>
    );
  }

  return (
    <HPModal
      width={"672"}
      open={open}
      onClose={onClose}
      title={title}
      textCustomBtnConfirm={"Save"}
      onOK={onFinish}
    >
      {children}
    </HPModal>
  );
};

export default function ModalEditProfile({ onClose, open }: Props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const isMobileDevice = useMediaQuery({ maxWidth: EResponsiveBreakpoint.xs });

  useEffect(() => {
    setCheckbox(user?.holdingTankStatus ?? false);
  }, [user?.holdingTankStatus]);

  const onFinish = async () => {
    try {
      const formData = await form.validateFields();
      const [res, error] = await userServices.updateProfile({
        ...formData,
        birthday: dayjs(formData.birthday).unix() * 1000,
        holdingTankStatus: checkbox,
      });
      if (res) {
        store.dispatch(userActions.getUserInfoRequest());
        toast.success("Update profile successfully");
        onClose();
      } else {
        toast.error("Update profile fail");
      }
    } catch (error) {
      console.log("Validate error: ", error);
    }
  };

  return (
    <FormContainer
      isMobile={isMobileDevice}
      open={open}
      title={t("modal.modalEditProfile.title")}
      cancelText={t("myOrder.btn.cancel")}
      confirmText={t("modal.modalFormShipping.Save")}
      onClose={onClose}
      onFinish={onFinish}
    >
      <Form<ICommentForm>
        form={form}
        name="fontEditProfile"
        initialValues={{
          ...user,
          birthday: user?.birthday ? dayjs(user?.birthday) : "",
        }}
        scrollToFirstError
        layout="vertical"
        className={style.formEditProfile}
      >
        <Row gutter={{ xs: 8, sm: 32 }}>
          <Col span={24}>
            <Row gutter={{ xs: 8, sm: 20 }}>
              <Col xs={24} sm={12}>
                <Form.Item<ICommentForm>
                  name="name"
                  rules={[]}
                  normalize={(value) => {
                    return value === " " ? "" : value;
                  }}
                  label={t("modal.modalEditProfile.inputFullName")}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item<ICommentForm>
                  name="preferredName"
                  rules={[]}
                  normalize={(value) => {
                    return value === " " ? "" : value;
                  }}
                  label={t("modal.modalEditProfile.inputPreferredName")}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 20 }}>
              <Col xs={24} sm={12}>
                <Form.Item<ICommentForm>
                  name="company"
                  rules={[]}
                  normalize={(value) => {
                    return value === " " ? "" : value;
                  }}
                  label={t("modal.modalEditProfile.inputCompany")}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item<ICommentForm>
                  name="personalWebsite"
                  rules={[
                    {
                      validator(_rule, value, callback) {
                        if (value && !isWebsiteAddress(value)) {
                          return Promise.reject(
                            t("modal.modalEditProfile.invalid url")
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                  normalize={(value) => value.trim()}
                  label={t("modal.modalEditProfile.inputPersonalWebsite")}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 20 }}>
              <Col xs={24} sm={12}>
                <Form.Item<ICommentForm>
                  name="birthday"
                  label={t("modal.modalEditProfile.inputDateOfBirth")}
                >
                  <DatePicker format="MM/DD/YYYY" />
                  {/* <Input /> */}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item<ICommentForm>
                  name="preferredLanguage"
                  rules={[]}
                  label={t("modal.modalEditProfile.inputPreferredLanguage")}
                >
                  <HPSelect
                    defaultValue={"en-hk"}
                    options={[
                      {
                        label: "English - Hong Kong",
                        value: "en-hk",
                      },
                      {
                        label: "English - Viet Nam",
                        value: "en-vi",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item<ICommentForm> name="checkbox">
                  <Checkbox
                    checked={checkbox}
                    onChange={(e) => setCheckbox(e.target.checked)}
                  >
                    {t("modal.modalEditProfile.inputCheckbox")}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item<ICommentForm>
                  name="replicatedSiteText"
                  rules={[]}
                  normalize={(value) => {
                    return value === " " ? "" : value;
                  }}
                  label={t("modal.modalEditProfile.inputReplicatedSiteText")}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
}

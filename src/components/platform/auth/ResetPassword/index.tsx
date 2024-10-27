import { Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ERoutePath } from "../../../../app/constants/path";
import { authServices } from "../../../../service/authServices";
import style from "./style.module.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";
import { CheckCircleOutlined } from "@ant-design/icons";

type Props = {
  email: string;
  token: string | null;
};

interface ICommentForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword({ token }: Props) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { t } = useTranslation();

  const onFinish = async (formData: ICommentForm) => {
    if (!token) return;
    setIsProcessing(true);
    const [res, error]: any[] = await authServices.forgetPassword({
      normalToken: token,
      password: formData.password,
    });
    if (error) {
      setIsProcessing(false);
      toast.error(t("resetPassword.toastResetPasswordError"));
    } else {
      if (window.innerWidth <= EResponsiveBreakpoint.xs) {
        Modal.success({
          title: t("resetPassword.toastResetPasswordSuccess"),
          content: t("resetPassword.reset description"),
          icon: <CheckCircleOutlined />,
          okButtonProps: {
            className: `${style["mobile-confirm-button"]} ant-btn-custom`,
          },
          okText: t("resetPassword.btnConfirm"),
        });
      } else {
        toast.success(t("resetPassword.toastResetPasswordSuccess"));
      }

      navigate(ERoutePath.LOGIN);
    }
    setIsProcessing(false);
  };

  return (
    <div className={style.container}>
      {/* <img className={style.logo} src={LogoPlatform} alt="logo" width={332} /> */}
      <div className={style.form}>
        <span className={style.title}>{t("resetPassword.title")}</span>
        <Form<ICommentForm>
          form={form}
          name="forgotPassword"
          onFinish={onFinish}
          initialValues={{}}
          scrollToFirstError
        >
          <Form.Item<ICommentForm>
            name="password"
            rules={[
              {
                required: true,
                message: t("resetPassword.requirePassword"),
              },
            ]}
            normalize={(value) => value.trim()}
          >
            <Input.Password placeholder={t("resetPassword.inputPassword")} />
          </Form.Item>
          <Form.Item<ICommentForm>
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: t("resetPassword.requirePasswordConfirm"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("resetPassword.validatePasswordConfirm"))
                  );
                },
              }),
            ]}
            normalize={(value) => value.trim()}
          >
            <Input.Password
              placeholder={t("resetPassword.inputPasswordConfirm")}
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="ant-btn-custom"
              htmlType="submit"
              loading={isProcessing}
              disabled={isProcessing}
            >
              {t("resetPassword.btnConfirm")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

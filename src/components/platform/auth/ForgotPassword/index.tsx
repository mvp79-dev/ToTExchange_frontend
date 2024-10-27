import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ERoutePath } from "../../../../app/constants/path";
import {
  ETypeRequestSendOTP,
  authServices,
} from "../../../../service/authServices";
import AuthLayout from "../../../layouts/AuthLayout";
import UpdatePassword from "../ResetPassword";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";

interface ICommentForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<"default" | "changePassword">("default");
  const token = new URLSearchParams(location.search).get("token");
  const expireTime = new URLSearchParams(location.search).get("expireTime");
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const onFinish = async (formData: ICommentForm) => {
    const [res, error]: any[] = await authServices.requestResendOtp({
      email: formData.email,
      type: ETypeRequestSendOTP.reset_password,
    });
    if (error) {
      if (error.status === 404) {
        form.setFields([
          {
            name: "email",
            errors: [t("forgotPassword.errorEmailNotFound")],
          },
        ]);
      } else {
        toast.error(error?.data?.message);
      }
    } else {
      toast.success(t("forgotPassword.toastCheckEmail"));
    }
  };

  useEffect(() => {
    if (token && expireTime) {
      setStep("changePassword");
      if (Date.now() > Number(expireTime)) {
        toast.error(t("forgotPassword.warningOTP"));
      }
    } else {
      setStep("default");
    }
  }, [expireTime, location.search, t, token]);

  return (
    <>
      {step === "default" ? (
        <div className={style.container}>
          <div className={style.form}>
            <span className={style.title}>{t("forgotPassword.title")}</span>
            <Form<ICommentForm>
              form={form}
              name="forgotPassword"
              onFinish={onFinish}
              initialValues={{}}
              scrollToFirstError
            >
              <Form.Item<ICommentForm>
                name="email"
                rules={[
                  {
                    type: "email",
                    message: t("forgotPassword.validateEmail"),
                  },
                  {
                    required: true,
                    message: t("forgotPassword.requireEmail"),
                  },
                ]}
                normalize={(value) => value.trim()}
              >
                <Input placeholder={t("forgotPassword.inputEmail")} />
              </Form.Item>

              <Form.Item>
                <Button className="ant-btn-custom" htmlType="submit">
                  {t("forgotPassword.btnContinue")}
                </Button>
              </Form.Item>
            </Form>
            <Button
              onClick={() => {
                navigate(ERoutePath.LOGIN);
              }}
              className={style.btnBack}
            >
              {t("forgotPassword.btnBack")}
            </Button>
          </div>
        </div>
      ) : (
        <UpdatePassword email={form.getFieldValue("email")} token={token} />
      )}
    </>
  );
}

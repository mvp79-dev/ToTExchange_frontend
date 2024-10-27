import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { useEffect, useState, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { KEY } from "@/app/constants/request";
import { useAppDispatch } from "@/app/hooks";
import { REGEX_ACCOUNT_NAME } from "@/app/regex";
import IconFacebook from "@/assets/icons/facebook-icon.jpg";
import IconGoogle from "@/assets/icons/google-icon.jpg";
import {
  EMessVerifyOTP,
  ETypeRequestSendOTP,
  IDataLogin,
  authServices,
} from "@/service/authServices";
import AuthLayout from "../../../layouts/AuthLayout";
import VerifyOTP from "../VerifyOTP";
import style from "./style.module.scss";
import { userActions } from "@/features/user/userSlice";
import { toast } from "react-toastify";
import sign from "jwt-encode";
import jwt_decode from "jwt-decode";
import { useTranslation } from "react-i18next";

interface ICommentForm {
  accountName: string;
  password: string;
  rememberLogin: boolean;
}

const TypedFormField = Form.Item<ICommentForm>;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errorOTP, setErrorOTP] = useState<boolean>(false);
  const [isVerifyOTPStep, setIsVerifyOTPStep] = useState<boolean>(false);
  const [counter, setCounter] = useState<any>(
    Number(process.env.REACT_APP_EXPIRY_TIME_OTP)
  );
  const [normalToken, setNormalToken] = useState<string>();
  const [emailStatus, setEmailStatus] = useState<number>();

  const [isProcessingLogin, setIsProcessingLogin] = useState<boolean>(false);
  const [isProcessingVerifyOTP, setIsProcessingVerifyOTP] =
    useState<boolean>(false);

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onFinish = async (formData: ICommentForm) => {
    setIsProcessingLogin(true);
    const [res, error]: any[] = await authServices.login({
      userName: formData.accountName,
      password: formData.password,
    });
    if (error) {
      setIsProcessingLogin(false);
      form.setFields([
        {
          name: "accountName",
          errors: [t("login.validateAccountPass")],
        },
        {
          name: "password",
          errors: [t("login.validateAccountPass")],
        },
      ]);
    } else {
      setNormalToken(res?.data?.data?.normalToken);
      setEmailStatus(res?.data?.data?.emailStatus);
      const [_, error]: any[] = await authServices.requestResendOtp({
        normalToken: res?.data?.data?.normalToken,
        type: ETypeRequestSendOTP.verify,
      });
      if (error) {
        setIsProcessingLogin(false);
        toast.error("Error");
      } else {
        setIsVerifyOTPStep(true);
      }
    }
    setIsProcessingLogin(false);
  };

  const userName = Form.useWatch("accountName", form);
  const passwordUser = Form.useWatch("password", form);

  const handleVerifyOTP = async (otp: string) => {
    if (!normalToken) return;
    setIsProcessingVerifyOTP(true);
    const [res, error]: any[] = await authServices.verifyOtp({
      normalToken,
      otp: Number(otp),
    });
    if (error) {
      setIsProcessingVerifyOTP(false);
      if (error?.data?.message === EMessVerifyOTP.wrong) {
        setErrorOTP(true);
      } else if (error?.data?.message === EMessVerifyOTP.expires) {
        setErrorOTP(false);
        toast.error(t("login.warningOTPExpire"));
      } else {
        setErrorOTP(false);
        toast.error("Error");
      }
    } else {
      const resData: IDataLogin = res.data;
      localStorage.setItem(KEY.ACCESS_TOKEN, resData.accessToken);
      localStorage.setItem(KEY.REFRESH_TOKEN, resData.refreshToken);
      const rememberLogin = form.getFieldValue("rememberLogin");
      if (rememberLogin) {
        const infoUser = {
          userName,
          passwordUser,
        };
        const token = sign(
          infoUser,
          process.env.REACT_APP_JWT_SECRET_KEY as string
        );
        localStorage.setItem(KEY.TOKEN_REMEMBER_ME, token);
      } else {
        localStorage.removeItem(KEY.TOKEN_REMEMBER_ME);
      }
      dispatch(userActions.getUserInfoSuccess(resData.user));
      navigate(ERoutePath.DASH_BOARD_USER);
    }
    setIsProcessingVerifyOTP(false);
  };

  const handleResendOTP = async () => {
    if (!normalToken) return;
    const [res, error]: any[] = await authServices.requestResendOtp({
      normalToken,
      type: ETypeRequestSendOTP.verify,
    });
    if (error) {
      toast.error(t("login.toastResendOTPError"));
    } else {
      setCounter(new Number(process.env.REACT_APP_EXPIRY_TIME_OTP));
      toast.success(t("login.toastResendOTPSuccess"));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(KEY.TOKEN_REMEMBER_ME);
    if (!token) return;
    const { userName, password }: { userName: string; password: string } =
      jwt_decode(token);
    startTransition(() => {
      form.setFieldValue("accountName", userName);
      form.setFieldValue("password", password);
      form.setFieldValue("rememberLogin", true);
    });
  }, [form]);

  return (
    <>
      {!isVerifyOTPStep ? (
        <div className={style.container}>
          <div className={style.form}>
            <span className={style.title}>{t("login.title")}</span>
            <Form<ICommentForm>
              form={form}
              name="login"
              onFinish={onFinish}
              initialValues={{}}
              style={{ maxWidth: 600 }}
              scrollToFirstError
            >
              <TypedFormField
                name="accountName"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(t("login.requireAccountName"));
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
                normalize={(value) => value.trim()}
              >
                <Input
                  placeholder={t("login.inputAccountName")}
                  prefix={<UserOutlined />}
                />
              </TypedFormField>
              <TypedFormField
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("login.requirePassword"),
                  },
                ]}
                normalize={(value) => value.trim()}
              >
                <Input.Password
                  placeholder={t("login.inputPassword")}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </TypedFormField>
              <div className={style.forgotPass}>
                <TypedFormField name="rememberLogin" valuePropName="checked">
                  <Checkbox>{t("login.inputRememberMe")}</Checkbox>
                </TypedFormField>
                <span
                  onClick={() => {
                    navigate(ERoutePath.FORGOT_PASSWORD);
                  }}
                  className={style.highlightText}
                >
                  {t("login.textForgotPassword")}
                </span>
              </div>
              <div>
                <Button
                  className="ant-btn-custom"
                  htmlType="submit"
                  loading={isProcessingLogin}
                  disabled={isProcessingLogin}
                >
                  {t("login.btnLogin")}
                </Button>
              </div>
            </Form>
            {/* <div className={style["form__alternative-signin"]}>
              <Button className={style.btnGF}>
                <img src={IconGoogle} alt="icon_google" />
                <span>{t("login.btnLoginWithGoogle")}</span>
              </Button>
              <Button className={style.btnGF}>
                <img src={IconFacebook} alt="icon_facebook" />
                <span>{t("login.btnLoginWithFacebook")}</span>
              </Button>
            </div> */}
            <div className={style.btnRedirectLogin}>
              {t("login.textYouNotAccount")}{" "}
              <span
                onClick={() => {
                  navigate(ERoutePath.REGISTER);
                }}
                className={style.highlightText}
              >
                {t("login.textRegister")}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <VerifyOTP
          titleBtn={t("login.titleBtnVerifyOtp")}
          title={
            emailStatus === 1
              ? t("login.titleVerifyOtp")
              : t("login.titleVerifyAccount")
          }
          errorOTP={errorOTP}
          onClick={handleVerifyOTP}
          countdown={counter}
          onResendOTP={handleResendOTP}
          loadingBtn={isProcessingVerifyOTP}
        />
      )}
    </>
  );
}

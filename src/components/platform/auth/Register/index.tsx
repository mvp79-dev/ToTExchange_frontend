import { Button, Checkbox, Form, Input, Radio } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ERoutePath } from "../../../../app/constants/path";
import { useDebounce } from "../../../../app/hooks";
import {
  REGEX_ACCOUNT_NAME,
  REGEX_PASSWORD,
  REGEX_PHONE_NUMBER,
} from "../../../../app/regex";
import IconFacebook from "../../../../assets/icons/facebook-icon.jpg";
import IconGoogle from "../../../../assets/icons/google-icon.jpg";
import {
  EMessVerifyOTP,
  ETypeRequestSendOTP,
  IDataLogin,
  authServices,
} from "../../../../service/authServices";
import { userServices } from "../../../../service/userService";
import AuthLayout from "../../../layouts/AuthLayout";
import VerifyOTP from "../VerifyOTP";
import style from "./style.module.scss";
import { KEY } from "@/app/constants/request";
import { userActions } from "@/features/user/userSlice";
import store from "@/app/store";
import { useTranslation } from "react-i18next";
import { EDirectionType, EUserRole } from "@/interfaces/user";
import { EKeySearchUrlRegister } from "@/interfaces/common";

interface ICommentForm {
  email: string;
  password: string;
  fullName: string;
  referralCode: string;
  accountName: string;
  phoneNumber: string;
  typeCustomer: EUserRole;
  direction: string;
}

export default function RegisterPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorOTP, setErrorOTP] = useState<boolean>(false);
  const [step, setStep] = useState<boolean>(false);
  const [counter, setCounter] = useState<any>(
    Number(process.env.REACT_APP_EXPIRY_TIME_OTP)
  );
  const referralCode = Form.useWatch("referralCode", form);
  const debouncedSearchReferral = useDebounce(referralCode);
  const [infoSponsor, setInfoSponsor] = useState<{
    name: string;
    refCode: number;
  }>();
  const [normalToken, setNormalToken] = useState<string>();
  const registerPageRef = useRef<any>(null);
  const [isProcessingRegister, setIsProcessingRegister] =
    useState<boolean>(false);
  const [isProcessingVerifyOTP, setIsProcessingVerifyOTP] =
    useState<boolean>(false);

  const { t } = useTranslation();

  const findSponsor = async (code: string) => {
    const [res, error]: any[] = await userServices.findSponsor(code);
    if (res) {
      setInfoSponsor(res?.data);
    } else {
      setInfoSponsor(undefined);
      form.setFields([
        {
          name: "referralCode",
          errors: [t("register.errorSponsorNotFound")],
        },
      ]);
    }
  };

  useEffect(() => {
    const referralCode = new URLSearchParams(location.search).get(
      EKeySearchUrlRegister.referralCode
    );
    if (referralCode) {
      form.setFieldValue("referralCode", referralCode);
    }
  }, [form, location.search]);

  useEffect(() => {
    if (!debouncedSearchReferral) return;
    findSponsor(debouncedSearchReferral);
  }, [debouncedSearchReferral]);

  const onFinish = async (formData: ICommentForm) => {
    setIsProcessingRegister(true);
    const direction = new URLSearchParams(location.search).get(
      EKeySearchUrlRegister.direction
    );
    await form.validateFields();
    const [res, error]: any[] = await authServices.register({
      email: formData.email,
      password: formData.password,
      name: formData.fullName.trim(),
      refCode: formData.referralCode,
      userName: formData.accountName,
      phoneNumber: formData.phoneNumber,
      userType: formData.typeCustomer,
      direction: (direction as EDirectionType) ?? EDirectionType.LEFT,
    });
    if (error) {
      setIsProcessingRegister(false);
      if (error.status === 404) {
        form.setFields([
          {
            name: "referralCode",
            errors: [t("register.errorSponsorNotFound")],
          },
        ]);
      } else if (error.status === 400) {
        if (error.data.code === 2) {
          form.setFields([
            {
              name: "email",
              errors: [t("register.errorEmailExist")],
            },
          ]);
        } else if (error.data.code === 3) {
          form.setFields([
            {
              name: "accountName",
              errors: [t("register.errorAccountExist")],
            },
          ]);
        } else if (error.data.code === 4) {
          form.setFields([
            {
              name: "phoneNumber",
              errors: [t("register.existPhone")],
            },
          ]);
        } else {
          toast.error(error?.data?.message);
        }
      }
    } else {
      setNormalToken(res?.data?.normalToken);
      toast.success(t("register.successRegister"));
      setStep(true);
      registerPageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
    setIsProcessingRegister(false);
  };

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
        toast.error(t("register.warningOTPExpire"));
      } else {
        setErrorOTP(false);
        toast.error("Error");
      }
    } else {
      toast.success(t("register.successVerifyAccount"));
      const resData: IDataLogin = res.data;
      localStorage.setItem(KEY.ACCESS_TOKEN, resData.accessToken);
      localStorage.setItem(KEY.REFRESH_TOKEN, resData.refreshToken);
      store.dispatch(userActions.getUserInfoSuccess(resData.user));
      navigate(ERoutePath.HOME);
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
      toast.error(t("register.toastResendOTPError"));
    } else {
      setCounter(new Number(process.env.REACT_APP_EXPIRY_TIME_OTP));
      toast.success(t("register.toastResendOTPSuccess"));
    }
  };

  return (
    <>
      <div ref={registerPageRef}>
        {!step ? (
          <div className={style.container}>
            <div className={style.form}>
              <span className={style.title}>{t("register.title")}</span>

              <Form<ICommentForm>
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                  typeCustomer: EUserRole.collaborator,
                }}
                style={{ maxWidth: 600 }}
                scrollToFirstError
              >
                <Form.Item<ICommentForm> name="typeCustomer">
                  <Radio.Group>
                    <Radio value={EUserRole.collaborator}>
                      {t("register.textDistributer")}
                    </Radio>
                    <Radio value={EUserRole.customer}>
                      {t("register.textCustomer")}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item<ICommentForm>
                  name="accountName"
                  rules={[
                    {
                      validator: (_, value) => {
                        return !value
                          ? Promise.reject(
                              new Error(t("register.requireAccountName"))
                            )
                          : new RegExp(REGEX_ACCOUNT_NAME).test(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(t("register.validateAccountName"))
                            );
                      },
                    },
                    {
                      min: 3,
                      message: t("register.validateAccountNameMinLength"),
                    },
                    {
                      max: 30,
                      message: t("register.validateAccountNameMaxLength"),
                    },
                  ]}
                  normalize={(value) => value.trim()}
                >
                  <Input placeholder={t("register.inputAccountName")} />
                </Form.Item>
                <Form.Item<ICommentForm>
                  name="password"
                  rules={[
                    {
                      validator: (_, value) => {
                        return !value
                          ? Promise.reject(
                              new Error(t("register.requirePassword"))
                            )
                          : new RegExp(REGEX_PASSWORD).test(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(t("register.validatePassword"))
                            );
                      },
                    },
                  ]}
                  normalize={(value) => value.trim()}
                >
                  <Input.Password placeholder={t("register.inputPassword")} />
                </Form.Item>
                <Form.Item<ICommentForm>
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: t("register.requireFullName"),
                    },
                  ]}
                  normalize={(value) => {
                    return value === " " ? "" : value;
                  }}
                >
                  <Input placeholder={t("register.inputFullName")} />
                </Form.Item>
                <Form.Item<ICommentForm>
                  name="phoneNumber"
                  rules={[
                    {
                      validator: (_, value) => {
                        return !value
                          ? Promise.reject(
                              new Error(t("register.requirePhoneNumber"))
                            )
                          : new RegExp(REGEX_PHONE_NUMBER).test(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(t("register.validatePhoneNumber"))
                            );
                      },
                    },
                  ]}
                  normalize={(value) => value.trim()}
                >
                  <Input placeholder={t("register.inputPhoneNumber")} />
                </Form.Item>
                <Form.Item<ICommentForm>
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: t("register.validateEmail"),
                    },
                    {
                      required: true,
                      message: t("register.requireEmail"),
                    },
                  ]}
                  normalize={(value) => value.trim()}
                >
                  <Input placeholder={t("register.inputEmail")} />
                </Form.Item>
                <Form.Item<ICommentForm>
                  name="referralCode"
                  rules={[
                    {
                      required: true,
                      message: t("register.requireReferral"),
                    },
                  ]}
                  normalize={(value) => value.trim()}
                >
                  <Input placeholder={t("register.inputReferral")} />
                </Form.Item>
                {infoSponsor && (
                  <div className={style.sponsor}>
                    <span className={style.sponsorName}>
                      {infoSponsor?.name}
                    </span>
                    <span className={style.sponsorCode}>
                      {t("register.textSponsorId")} {infoSponsor?.refCode}
                    </span>
                  </div>
                )}
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(t("register.validateAgreement"))
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    {t("register.textAgreement")}{" "}
                    <span className={style.highlightText}>
                      {t("register.textAgreementTermsOfUse")}
                    </span>{" "}
                    &{" "}
                    <span className={style.highlightText}>
                      {t("register.textAgreementPrivacyPolicy")}
                    </span>
                  </Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    className="ant-btn-custom"
                    htmlType="submit"
                    loading={isProcessingRegister}
                    disabled={isProcessingRegister}
                  >
                    {t("register.btnRegister")}
                  </Button>
                </Form.Item>
              </Form>
              {/* <Button className={style.btnGF}>
                <img src={IconGoogle} alt="icon_google" />
                <span>{t("register.btnRegisterWithGoogle")}</span>
              </Button>
              <Button className={style.btnGF}>
                <img src={IconFacebook} alt="icon_facebook" />
                <span> {t("register.btnRegisterWithFacebook")}</span>
              </Button> */}
              <div className={style.btnRedirectLogin}>
                {t("register.textYouHaveAccount")}{" "}
                <span
                  onClick={() => {
                    navigate(ERoutePath.LOGIN);
                  }}
                  className={style.highlightText}
                >
                  {t("register.textLoginNow")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <VerifyOTP
            title={t("register.titleVerifyAccount")}
            titleBtn={t("register.titleBtnVerifyOtp")}
            errorOTP={errorOTP}
            onClick={handleVerifyOTP}
            countdown={counter}
            onResendOTP={handleResendOTP}
            email={form.getFieldValue("email")}
            loadingBtn={isProcessingVerifyOTP}
          />
        )}
      </div>
    </>
  );
}

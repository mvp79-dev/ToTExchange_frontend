import { ERecipientType } from "@/app/constants/withdrawal";
import { IWithdrawForm } from "@/interfaces/withdrawal";
import { Button, Col, Form, Input, Row, Space } from "antd";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { REGEX_INPUT_AMOUNT } from "@/app/regex";
import { useAppSelector } from "@/app/hooks";
import { takeDecimalNumber } from "@/app/common/helper";
import { EUserRole } from "@/interfaces/user";

interface IProps {
  onSubmit: (form: IWithdrawForm) => void;
  activeRecipientType?: ERecipientType;
  setActiveRecipientType: (type: ERecipientType) => void;
}

function InternalUserWithdrawalForm({
  onSubmit,
  activeRecipientType,
  setActiveRecipientType,
}: IProps) {
  const form = Form.useFormInstance<IWithdrawForm>();
  const withdrawCurrency = Form.useWatch(["currency"], form);
  const { user, infoWithdrawToday } = useAppSelector((state) => state.user);
  const { userConfigs } = useAppSelector((state) => state.app);

  const { t } = useTranslation();

  function changeRecipientType(type: ERecipientType) {
    setActiveRecipientType(type);
  }

  async function submitFormHandler() {
    try {
      const formData = await form.validateFields();
      onSubmit(formData);
    } catch (error) {
      return;
    }
  }

  const remainingAmountWithdrawn =
    Number(infoWithdrawToday?.limit) -
    Number(infoWithdrawToday?.withdraw_today);

  const checkRoleIsAdmin = user?.role === EUserRole.admin;

  return (
    <Space
      direction="vertical"
      size={20}
      className={styles["internal-user-withdrawal-form"]}
    >
      <Space size={12}>
        <Button
          type="primary"
          className={classNames(
            styles["internal-user-withdrawal-form__switch-recipient-type"],
            styles["btn"],
            {
              [styles["active"]]: activeRecipientType === ERecipientType.EMAIL,
            }
          )}
          onClick={() => changeRecipientType(ERecipientType.EMAIL)}
        >
          Email
        </Button>
        <Button
          type="primary"
          className={classNames(
            styles["internal-user-withdrawal-form__switch-recipient-type"],
            styles["btn"],
            {
              [styles["active"]]: activeRecipientType === ERecipientType.ID,
            }
          )}
          onClick={() => changeRecipientType(ERecipientType.ID)}
        >
          Happy356 ID
        </Button>
      </Space>

      <Form.Item<IWithdrawForm>
        name={["internalUser", "recipient"]}
        className={styles["internal-user-withdrawal-form__receiver"]}
        rules={[
          {
            validator: (_, value) => {
              return !activeRecipientType
                ? Promise.resolve()
                : value
                ? Promise.resolve()
                : Promise.reject(new Error(t("register.requireEmail")));
            },
          },
        ]}
        normalize={(value) => value.trim()}
      >
        <Input
          placeholder={
            activeRecipientType === ERecipientType.EMAIL
              ? t("dashboardUser.withdrawal.Recipients email")
              : t("dashboardUser.withdrawal.Recipients ID")
          }
        />
      </Form.Item>

      {withdrawCurrency && (
        <>
          <Form.Item
            label={<span>{t("dashboardUser.withdrawal.Withdraw amount")}</span>}
            rules={[
              {
                validator: (_, value) => {
                  return !activeRecipientType
                    ? Promise.resolve()
                    : !value
                    ? Promise.reject(
                        new Error(t("dashboardUser.withdrawal.requireAmount"))
                      )
                    : !new RegExp(REGEX_INPUT_AMOUNT).test(value)
                    ? Promise.reject(
                        new Error(t("dashboardUser.withdrawal.validateAmount"))
                      )
                    : Number(value) <= 0
                    ? Promise.reject(
                        new Error(t("toastErrorCommon.Message-2.1"))
                      )
                    : Number(value) > Number(user?.balance)
                    ? Promise.reject(
                        new Error(t("toastErrorCommon.Message-2.2"))
                      )
                    : checkRoleIsAdmin
                    ? Promise.resolve()
                    : Number(value) < Number(userConfigs?.MIN_WITHDRAW)
                    ? Promise.reject(
                        new Error(
                          t("dashboardUser.withdrawal.validateMinimumAmount", {
                            amount: `${userConfigs?.MIN_WITHDRAW}$`,
                          })
                        )
                      )
                    : Number(value) > remainingAmountWithdrawn
                    ? Promise.reject(
                        new Error(t("toastErrorCommon.Message-2.3"))
                      )
                    : Promise.resolve();
                },
              },
            ]}
            normalize={(value) => value.trim()}
            name={["internalUser", "amount"]}
          >
            <Input
              placeholder={
                checkRoleIsAdmin
                  ? "Input amount"
                  : t("dashboardUser.withdrawal.Minimal amount", {
                      amount: userConfigs?.MIN_WITHDRAW,
                    })
              }
              suffix={
                <span className={styles["max-amount-btn"]}>
                  <div
                    onClick={() => {
                      form.setFieldsValue({
                        internalUser: {
                          amount: takeDecimalNumber(
                            user?.balance ?? 0
                          ).toString(),
                        },
                      });
                    }}
                  >
                    {t("dashboardUser.withdrawal.MAX")}
                  </div>
                  <span>|</span>
                  <span>{withdrawCurrency}</span>
                </span>
              }
            />
          </Form.Item>
          <Row
            className={styles["internal-user-withdrawal-form__info"]}
            gutter={[20, 0]}
          >
            <Col span={12}>
              <p
                className={styles["internal-user-withdrawal-form__info__title"]}
              >
                {t("dashboardUser.withdrawal.Balance", {
                  currency: withdrawCurrency,
                })}
              </p>
              <p
                className={styles["internal-user-withdrawal-form__info__info"]}
              >
                {user?.balance} {withdrawCurrency}
              </p>
            </Col>
            {!checkRoleIsAdmin && (
              <Col span={12}>
                <p
                  className={
                    styles["internal-user-withdrawal-form__info__title"]
                  }
                >
                  {t("dashboardUser.withdrawal.Daily remaining limit")}
                </p>
                <p
                  className={
                    styles["internal-user-withdrawal-form__info__info"]
                  }
                >
                  {takeDecimalNumber(
                    Number(infoWithdrawToday?.limit) -
                      Number(infoWithdrawToday?.withdraw_today)
                  )}
                  /{takeDecimalNumber(Number(infoWithdrawToday?.limit))}{" "}
                  {withdrawCurrency}
                </p>
              </Col>
            )}
          </Row>
          <Button
            type="primary"
            className={styles["internal-user-withdrawal-form__submit-btn"]}
            onClick={submitFormHandler}
          >
            {t("forgotPassword.btnContinue")}
          </Button>
        </>
      )}
    </Space>
  );
}

export default InternalUserWithdrawalForm;

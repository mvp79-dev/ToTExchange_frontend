import { takeDecimalNumber } from "@/app/common/helper";
import { useAppSelector } from "@/app/hooks";
import { REGEX_INPUT_AMOUNT, REGEX_WALLET_ADDRESS } from "@/app/regex";
import HPSelect from "@/components/common/Inputs/HPSelect";
import { IWithdrawForm } from "@/interfaces/withdrawal";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Radio, Row } from "antd";
import classNames from "classnames";
import { TFunction } from "i18next";
import { Fragment, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import bnbIcon from "../../../../../../../assets/images/bnb-icon.png";
import styles from "./styles.module.scss";
import { ERecipientType } from "@/app/constants/withdrawal";
import { EUserRole } from "@/interfaces/user";

const FormItem = Form.Item<IWithdrawForm>;

interface IProps {
  onSubmit: (form: IWithdrawForm) => void;
  overideBalance: number;
  processingSendOTP: boolean;
  activeRecipientType?: ERecipientType;
}

export const withdrawWalletType = (t: TFunction<"translation", undefined>) => {
  return [
    {
      label: t("dashboardUser.withdrawal.Internal Wallet"),
      value: "INTERNAL",
    },
  ];
};

function WalletWithdrawalForm({
  onSubmit,
  overideBalance,
  processingSendOTP,
  activeRecipientType,
}: IProps) {
  const { t } = useTranslation();
  const form = Form.useFormInstance<IWithdrawForm>();
  const { user, infoWithdrawToday } = useAppSelector((state) => state.user);
  const { userConfigs } = useAppSelector((state) => state.app);

  const withdrawCurrency = Form.useWatch(["currency"], form);
  const walletAddress = Form.useWatch(["walletUser", "walletAddress"], form);
  const withdrawNetwork = Form.useWatch(["walletUser", "network"], form);
  const withdrawAmount = Form.useWatch(["walletUser", "amount"], form);

  const isEnteredFullData = walletAddress && withdrawNetwork;

  const withdrawNetworks = useMemo(() => {
    return [
      {
        label: (
          <div
            style={{ display: "flex", alignItems: "center" }}
            className={
              styles["wallet-withdrawal-form__network-selection__item"]
            }
          >
            <img src={bnbIcon} className={styles["item__icon"]} />
            <span>BNB Smart Chain</span>
          </div>
        ),
        value: "BNB",
      },
    ];
  }, []);

  async function submitFormHandler() {
    try {
      const formData = await form.validateFields();
      onSubmit(formData);
    } catch (error) {
      return;
    }
  }

  const inputAddress = Form.useWatch(["walletUser", "walletAddress"], form);

  useEffect(() => {
    if (inputAddress) {
      form.setFieldValue(["internalUser", "recipient"], "");
    }
  }, [form, inputAddress]);

  const protocolFee = Number(userConfigs?.WITHDRAW_FEE) || 0;
  const remainingAmountWithdrawn =
    Number(infoWithdrawToday?.limit) -
    Number(infoWithdrawToday?.withdraw_today);

  const checkRoleIsAdmin = user?.role === EUserRole.admin;
  const userBalance = overideBalance || user?.balance || 0;

  return (
    <div className={styles["wallet-withdrawal-form"]}>
      <FormItem
        name={["walletUser", "walletAddress"]}
        label={t("dashboardUser.withdrawal.address")}
        rules={[
          {
            validator: (_, value) => {
              return activeRecipientType
                ? Promise.resolve()
                : !value
                ? Promise.reject(
                    new Error(t("dashboardUser.withdrawal.requireAddress"))
                  )
                : new RegExp(REGEX_WALLET_ADDRESS).test(value)
                ? Promise.resolve()
                : Promise.reject(
                    new Error(t("dashboardUser.withdrawal.validateAddress"))
                  );
            },
          },
        ]}
        normalize={(value) => value.trim()}
      >
        <Input
          placeholder={t("dashboardUser.withdrawal.Enter Address")}
          suffix={<InfoCircleOutlined />}
        />
      </FormItem>
      <FormItem
        name={["walletUser", "network"]}
        label={t("dashboardUser.withdrawal.Network")}
        className={styles["wallet-withdrawal-form__network-selection"]}
      >
        <HPSelect
          options={withdrawNetworks}
          placeholder={t("dashboardUser.withdrawal.Select withdrawal network")}
          onChange={() => {}}
        />
      </FormItem>

      {withdrawCurrency && (
        <>
          {isEnteredFullData ? (
            <Fragment>
              <FormItem
                label={
                  !checkRoleIsAdmin ? (
                    <span>
                      <span>
                        {t("dashboardUser.withdrawal.Withdraw amount")}
                      </span>
                      <span>
                        <span className={styles["limit"]}>
                          {takeDecimalNumber(
                            Number(infoWithdrawToday?.limit) -
                              Number(infoWithdrawToday?.withdraw_today)
                          )}
                          /{takeDecimalNumber(Number(infoWithdrawToday?.limit))}{" "}
                          {withdrawCurrency}
                        </span>
                        {t("dashboardUser.withdrawal.Daily remaining limit")}
                      </span>
                    </span>
                  ) : (
                    ""
                  )
                }
                rules={[
                  {
                    validator: (_, value) => {
                      return activeRecipientType
                        ? Promise.resolve()
                        : !value
                        ? Promise.reject(
                            new Error(
                              t("dashboardUser.withdrawal.requireAmount")
                            )
                          )
                        : !new RegExp(REGEX_INPUT_AMOUNT).test(value)
                        ? Promise.reject(
                            new Error(
                              t("dashboardUser.withdrawal.validateAmount")
                            )
                          )
                        : Number(value) <= 0
                        ? Promise.reject(
                            new Error(t("toastErrorCommon.Message-2.1"))
                          )
                        : Number(value) > Number(userBalance)
                        ? Promise.reject(
                            new Error(t("toastErrorCommon.Message-2.2"))
                          )
                        : checkRoleIsAdmin
                        ? Promise.resolve()
                        : Number(value) < Number(userConfigs?.MIN_WITHDRAW)
                        ? Promise.reject(
                            new Error(
                              t(
                                "dashboardUser.withdrawal.validateMinimumAmount",
                                {
                                  amount: `${userConfigs?.MIN_WITHDRAW}$`,
                                }
                              )
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
                name={["walletUser", "amount"]}
                className={styles["wallet-withdrawal-form__amount-input"]}
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
                    <span>
                      <Button
                        type="text"
                        className={styles["max-amount-btn"]}
                        onClick={() => {
                          form.setFieldsValue({
                            walletUser: {
                              amount: takeDecimalNumber(userBalance).toString(),
                            },
                          });
                        }}
                      >
                        {t("dashboardUser.withdrawal.MAX")}
                      </Button>
                      <span>|</span>
                      <span>{withdrawCurrency}</span>
                    </span>
                  }
                />
              </FormItem>
              <FormItem name={["walletUser", "withdrawWalletType"]}>
                <Radio.Group
                  className={
                    styles["wallet-withdrawal-form__wallet-options-list"]
                  }
                >
                  {/* <Space direction="vertical"> */}
                  {withdrawWalletType(t).map((walletType) => (
                    <div key={walletType.value}>
                      <Radio value={walletType.value}>{walletType.label}</Radio>
                      <span>
                        {takeDecimalNumber(userBalance)} {withdrawCurrency}
                      </span>
                    </div>
                  ))}
                  {/* </Space> */}
                </Radio.Group>
              </FormItem>
              {withdrawAmount &&
                Number(withdrawAmount) >= Number(userConfigs?.MIN_WITHDRAW) && (
                  <>
                    {" "}
                    {!checkRoleIsAdmin && (
                      <div className={styles["wallet-withdrawal-form__info"]}>
                        <p
                          className={classNames(
                            styles["wallet-withdrawal-form__info__title"],
                            styles["network-fee"]
                          )}
                        >
                          {t("dashboardUser.withdrawal.protocolFee")}
                        </p>
                        <p
                          className={
                            styles["wallet-withdrawal-form__info__info"]
                          }
                        >
                          {protocolFee} {withdrawCurrency}
                        </p>
                      </div>
                    )}
                    <div className={styles["wallet-withdrawal-form__info"]}>
                      <p
                        className={
                          styles["wallet-withdrawal-form__info__title"]
                        }
                      >
                        {t("dashboardUser.withdrawal.Receive amount")}
                      </p>
                      <p
                        className={
                          styles["wallet-withdrawal-form__receive-amount"]
                        }
                      >
                        {checkRoleIsAdmin
                          ? Number(withdrawAmount)
                          : Number(withdrawAmount) - protocolFee}{" "}
                        {withdrawCurrency}
                      </p>
                      <p
                        className={classNames(
                          styles["receive-amount-info"],
                          styles["wallet-withdrawal-form__info__title"]
                        )}
                      >
                        {t(
                          "dashboardUser.withdrawal.Change withdrawal amount to received amount"
                        )}
                      </p>
                    </div>
                    <Button
                      type="primary"
                      className={styles["wallet-withdrawal-form__submit-btn"]}
                      onClick={submitFormHandler}
                      disabled={processingSendOTP}
                      loading={processingSendOTP}
                    >
                      {t("forgotPassword.btnContinue")}
                    </Button>
                  </>
                )}
            </Fragment>
          ) : (
            <Row
              className={styles["wallet-withdrawal-form__info"]}
              gutter={[0, 16]}
            >
              <Col span={12}>
                <p className={styles["wallet-withdrawal-form__info__title"]}>
                  {t("dashboardUser.withdrawal.Balance", {
                    currency: withdrawCurrency,
                  })}
                </p>
                <p className={styles["wallet-withdrawal-form__info__info"]}>
                  {userBalance} {withdrawCurrency}
                </p>
              </Col>
              {!checkRoleIsAdmin && (
                <>
                  <Col span={12}>
                    <p
                      className={styles["wallet-withdrawal-form__info__title"]}
                    >
                      {t("dashboardUser.withdrawal.Minimum withdrawal")}
                    </p>
                    <p className={styles["wallet-withdrawal-form__info__info"]}>
                      {userConfigs?.MIN_WITHDRAW} {withdrawCurrency}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p
                      className={styles["wallet-withdrawal-form__info__title"]}
                    >
                      {t("dashboardUser.withdrawal.protocolFee")}
                    </p>
                    <p className={styles["wallet-withdrawal-form__info__info"]}>
                      {protocolFee}$
                    </p>
                  </Col>
                  <Col span={12}>
                    <p
                      className={styles["wallet-withdrawal-form__info__title"]}
                    >
                      {t("dashboardUser.withdrawal.24h remaining limit")}
                    </p>
                    <p className={styles["wallet-withdrawal-form__info__info"]}>
                      {takeDecimalNumber(
                        Number(infoWithdrawToday?.limit) -
                          Number(infoWithdrawToday?.withdraw_today)
                      )}
                      /{takeDecimalNumber(Number(infoWithdrawToday?.limit))}{" "}
                      {withdrawCurrency}
                    </p>
                  </Col>
                </>
              )}
            </Row>
          )}
        </>
      )}
    </div>
  );
}

export default WalletWithdrawalForm;

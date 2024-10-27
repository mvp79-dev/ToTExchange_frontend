import { useAppSelector } from "@/app/hooks";
import { REGEX_INPUT_AMOUNT } from "@/app/regex";
import store from "@/app/store";
import HPButton from "@/components/common/Button";
import { userActions } from "@/features/user/userSlice";
import { Form, Input } from "antd";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Address, useAccount } from "wagmi";
import { FetchBalanceResult, fetchBalance, fetchFeeData } from "wagmi/actions";
import { IDataDepositForm } from "..";
import profileIcon from "@/assets/icons/profile.svg";
import smallWarningIcon from "@/assets/icons/small-warning.svg";
import { radioPaymentMethods } from "../SelectCurrencyStep";
import styles from "./style.module.scss";
import BigNumber from "bignumber.js";
import { ESTIMATE_GAS } from "@/app/constants/config";
import { convertToDecimal } from "@/app/formatBigNmber";
import metamask_logo from "@/assets/images/metamask.png";
import { takeDecimalNumber } from "@/app/common/helper";

type Props = {
  onContinue: (amount: number) => void;
  onPrevious: () => void;
  dataForm: IDataDepositForm;
  loadingBtn: boolean;
  isAdmin: boolean;
};

export default function EnterAmountStep({
  onContinue,
  onPrevious,
  dataForm,
  loadingBtn,
  isAdmin,
}: Props) {
  const { t } = useTranslation();
  const { listCurrency } = useAppSelector((state) => state.app);
  const [form] = Form.useForm();
  const [amountReceive, setAmountReceive] = useState<number>();
  const [transactionFee, setTransactionFee] = useState<string>();
  const { address } = useAccount();
  const { balanceUSDT, balanceNetwork } = useAppSelector((state) => state.user);

  const getBalance = useCallback(async () => {
    if (!address) return;
    const balanceToken: FetchBalanceResult = await fetchBalance({
      address,
      chainId: Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED),
      token: process.env.REACT_APP_CONTRACT_USDT_HP as Address,
    });
    store.dispatch(
      userActions.getBalanceSuccess(Number(balanceToken.formatted))
    );
  }, [address]);

  const paymentMethodIndex = useMemo(() => {
    return (
      radioPaymentMethods(t).findIndex((el) => el.value === dataForm.method) ??
      0
    );
  }, [dataForm.method, t]);

  const onFinish = (data: any) => {
    onContinue(Number(data.amount));
  };

  const currencySymbol =
    listCurrency[
      listCurrency.findIndex((currency) => currency.id === dataForm.currency)
    ]?.symbol;

  // const protocolFee =
  //   typeof feePaymentMethod?.feeRate === "number"
  //     ? `${
  //         Number(feePaymentMethod?.feeRate ?? 0) * Number(amountReceive ?? 0)
  //       } ${currencySymbol}`
  //     : feePaymentMethod?.feeRate;

  const amountDeposit = Form.useWatch("amount", form);

  const estimateFee = async () => {
    const feeData = await fetchFeeData({
      chainId: Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED),
    });

    const estimateFee = new BigNumber(
      ESTIMATE_GAS * Number(feeData.formatted.gasPrice ?? 1)
    ).toString();
    setTransactionFee(convertToDecimal(Number(estimateFee), 18));
  };

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    setAmountReceive(takeDecimalNumber(amountDeposit) || 0);
  }, [amountDeposit]);

  useEffect(() => {
    estimateFee();
  }, []);

  return (
    <div className={styles["modalEnterAmount"]}>
      <div
        className={classNames(styles["wrapper"], { [styles.admin]: isAdmin })}
      >
        <div
          className={classNames(styles["amount"], { [styles.admin]: isAdmin })}
        >
          <Form form={form} initialValues={{}} onFinish={onFinish}>
            <div className={styles["inputAmount"]}>
              <div className={styles["inputAmount__label"]}>
                <label className={styles["inputAmount__label"]}>
                  {t("modal.modalDeposit.steps2.amount")}
                </label>
                <label className={styles["inputAmount__label"]}>
                  <span>
                    {t("modal.modalDeposit.steps2.transactionRequirement")}
                  </span>
                  <img src={smallWarningIcon} />
                </label>
              </div>
              <Form.Item
                name="amount"
                rules={[
                  {
                    validator: (_, value) => {
                      return !value
                        ? Promise.reject(
                            new Error(t("modal.modalDeposit.errors.amount"))
                          )
                        : !new RegExp(REGEX_INPUT_AMOUNT).test(value)
                        ? Promise.reject(new Error("Only number"))
                        : Number(value) <= 0
                        ? Promise.reject(
                            new Error(t("toastErrorCommon.Message-2.1"))
                          )
                        : Number(value) > Number(balanceUSDT)
                        ? Promise.reject(
                            new Error(t("toastErrorCommon.Message-2.2"))
                          )
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input suffix={<span>{currencySymbol}</span>} />
              </Form.Item>
              {t("modal.modalDeposit.steps2.user balance", {
                balance: Number(balanceUSDT) || 0,
                token: "USDT",
              })}
            </div>
            <p className={styles["text"]}>
              {t("modal.modalDeposit.steps2.youReceive")}
            </p>
            <h4 className={styles["number"]}>
              {amountReceive}&nbsp;
              {currencySymbol}
            </h4>
            <div className={styles["paymentInfo"]}>
              <p>{t("modal.modalDeposit.steps2.paymentMethod")}:</p>
              <p>
                <img src={metamask_logo} />{" "}
                <span>{radioPaymentMethods(t)[paymentMethodIndex]?.title}</span>
              </p>
            </div>
            <div className={styles["paymentInfo"]}>
              <p>{t("modal.modalDeposit.steps2.transactionFee")}:</p>
              <p>
                <span className={styles["paymentInfo__value"]}>
                  {transactionFee} {balanceNetwork?.symbol}
                </span>
              </p>
            </div>
            <div className={styles["btnGroup"]}>
              <HPButton
                title={t("modal.modalDeposit.btn.btnPrevious")}
                wrapperClassName={styles["btn"]}
                onClick={onPrevious}
                disabled={loadingBtn}
              />
              <HPButton
                title={t("modal.modalDeposit.btn.btnContinue")}
                htmlType="submit"
                wrapperClassName={classNames(
                  styles["btn"],
                  styles["btnActive"]
                )}
                disabled={loadingBtn}
                loading={loadingBtn}
              />
            </div>
          </Form>
        </div>
        <div
          className={classNames(styles["notice"], { [styles.admin]: isAdmin })}
        >
          <p className={styles["notice__link"]}>
            <img src={profileIcon} />
            <span>{t("modal.modalDeposit.steps2.link")}</span>
          </p>
          <p className={styles["notice__title"]}>
            {t("modal.modalDeposit.steps2.notice")}
          </p>
          <p className={styles["notice__content"]}>
            {t("modal.modalDeposit.steps2.noticeContent")}
          </p>
        </div>
      </div>
    </div>
  );
}

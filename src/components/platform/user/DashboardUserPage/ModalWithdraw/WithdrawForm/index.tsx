import { Form, Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";

import {
  ERecipientType,
  EWithdrawReceiverType,
} from "@/app/constants/withdrawal";
import { useAppSelector } from "@/app/hooks";
import HPSelect from "@/components/common/Inputs/HPSelect";
import { IWithdrawForm } from "@/interfaces/withdrawal";
import { useMemo } from "react";
import InternalUserWithdrawalForm from "./InternalUserWithdrawalForm";
import WalletWithdrawalForm from "./WalletWithdrawalForm";
import styles from "./styles.module.scss";

const FormItem = Form.Item<IWithdrawForm>;

interface IProps {
  isAdmin: boolean;
  onProceedToVerification: (form: IWithdrawForm) => void;
  processingSendOTP: boolean;
  overideBalance: number;
  activeRecipientType?: ERecipientType;
  setActiveRecipientType: (type?: ERecipientType) => void;
}

function WithdrawForm({
  isAdmin,
  overideBalance,
  onProceedToVerification,
  processingSendOTP,
  activeRecipientType,
  setActiveRecipientType,
}: IProps) {
  const [form] = Form.useForm<IWithdrawForm>();
  const { t } = useTranslation();
  const { listCurrency } = useAppSelector((state) => state.app);

  const currenciesList = listCurrency.map((el) => ({
    label: (
      <span className={styles["withdraw-form__currency-option"]}>
        <img src={el.symbolImage} alt="" width={18} height={18} />
        <span>{el.symbol}</span>
      </span>
    ),
    value: `${el.symbol}`,
  }));
  // useEffect(() => {
  //   dispatch(appActions.getUserConfigsRequest());
  // }, [dispatch]);

  const receiveTabList = useMemo(() => {
    const items: TabsProps["items"] = [
      {
        key: EWithdrawReceiverType.WALLET_ADDRESS,
        label: t("dashboardUser.withdrawal.address"),
        children: (
          <WalletWithdrawalForm
            overideBalance={overideBalance}
            onSubmit={onProceedToVerification}
            processingSendOTP={processingSendOTP}
            activeRecipientType={activeRecipientType}
          />
        ),
      },
    ];

    if (!isAdmin) {
      items.push({
        key: EWithdrawReceiverType.INTERNAL_USER,
        label: t("dashboardUser.withdrawal.Happy365 user"),
        children: (
          <InternalUserWithdrawalForm
            onSubmit={onProceedToVerification}
            activeRecipientType={activeRecipientType}
            setActiveRecipientType={setActiveRecipientType}
          />
        ),
      });
    }

    return items;
  }, [
    activeRecipientType,
    isAdmin,
    onProceedToVerification,
    overideBalance,
    processingSendOTP,
    setActiveRecipientType,
    t,
  ]);

  return (
    <Form<IWithdrawForm>
      form={form}
      layout="vertical"
      className={styles["withdraw-form"]}
      initialValues={{
        receiverType: EWithdrawReceiverType.WALLET_ADDRESS,
        walletUser: { withdrawWalletType: "INTERNAL" },
        internalUser: {
          recipientType: ERecipientType.EMAIL,
        },
      }}
    >
      <FormItem
        name="currency"
        label={t("dashboardUser.withdrawal.Select coin")}
        className={styles["withdraw-form__currency-selection"]}
      >
        <HPSelect options={currenciesList} />
      </FormItem>

      <FormItem
        name="receiverType"
        label={t("dashboardUser.withdrawal.Send to")}
        valuePropName="activeKey"
        className={styles["withdraw-form__receive-type-field"]}
      >
        <Tabs
          items={receiveTabList}
          className={styles["withdraw-form__receive-type-field__tabs"]}
          defaultValue={EWithdrawReceiverType.WALLET_ADDRESS}
          onChange={(e: string) =>
            setActiveRecipientType(
              e === EWithdrawReceiverType.WALLET_ADDRESS
                ? undefined
                : ERecipientType.EMAIL
            )
          }
        />
      </FormItem>
    </Form>
  );
}

export default WithdrawForm;

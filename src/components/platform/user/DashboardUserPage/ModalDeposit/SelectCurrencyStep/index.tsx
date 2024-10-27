import { useAppSelector } from "@/app/hooks";
import HPButton from "@/components/common/Button";
import HPSelect from "@/components/common/Inputs/HPSelect";
import {
  Button,
  Form,
  Radio,
  Select,
  Tabs,
  TabsProps,
  notification,
} from "antd";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { EMethodDeposit, IDataDepositForm } from "..";
import dropDownIcon from "@/assets/icons/menu-arrow-dropdown.svg";
import profileIcon from "@/assets/icons/profile.svg";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import metamask_logo from "@/assets/images/metamask.png";
import { BSCChain } from "@/app/constants/chain";
import { ICurrency } from "@/interfaces/currency";
import { PlusOutlined } from "@ant-design/icons";

type Props = {
  onContinue: (data: IDataDepositForm) => void;
  dataForm: IDataDepositForm;
};

type TRadioItem = {
  value: EMethodDeposit;
  title: string;
  subTitle: string;
  icon?: string;
};

interface ICommentForm {
  currency: number;
  methodOther: EMethodDeposit;
  methodRecommend: EMethodDeposit;
}

const INTERNAL_METHOD_OPTION_INDEX = 2;

export const radioPaymentMethods = (t: TFunction<"translation", undefined>) => [
  {
    value: EMethodDeposit.BankTransfer,
    title: t("modal.modalDeposit.steps1.option1.title"),
    subTitle: t("modal.modalDeposit.steps1.option1.content", { fee: "1EUR" }),
    feeRate: "1 EUR",
  },
  {
    value: EMethodDeposit.BankCard,
    title: t("modal.modalDeposit.steps1.option2.title"),
    subTitle: t("modal.modalDeposit.steps1.option2.content", { fee: "1.8%" }),
    feeRate: 1.8,
  },
  {
    value: EMethodDeposit.Metamask,
    title: t("modal.modalDeposit.steps1.option3.title"),
    subTitle: t("modal.modalDeposit.steps1.option3.content", { fee: "0%" }),
    feeRate: 0,
  },
];

const RadioItem = ({
  value,
  title,
  subTitle,
  icon = profileIcon,
}: TRadioItem) => (
  <Radio value={value}>
    <div className={styles["radioOption"]}>
      <img src={icon} className={styles["radioOption__item-icon"]} />
      <div className={styles["radioOption__item"]}>
        <p className={styles["radioOption__item-title"]}>{title}</p>
        <p className={styles["radioOption__item-subTitle"]}>{subTitle}</p>
      </div>
    </div>
  </Radio>
);

enum ETabSelectPaymentMethod {
  recommend = "recommend",
  otherMethod = "otherMethod",
}

const handleWeb3RequestError = (
  t: TFunction<"translation", undefined>,
  error: any
) => {
  if (error.code === 4001 || error.code === "ACTION_REJECTED") {
    notification.error({
      message: t("modal.modalDeposit.steps1.Request rejected"),
    });
    return;
  }

  notification.error({
    message: t("modal.modalDeposit.steps1.An error has occur"),
  });
};

export default function SelectCurrencyStep({ onContinue, dataForm }: Props) {
  const { t } = useTranslation();
  const { listCurrency } = useAppSelector((state) => state.app);
  const [activeTab, setActiveTab] = useState<ETabSelectPaymentMethod>(
    ETabSelectPaymentMethod.recommend
  );
  const [form] = Form.useForm<ICommentForm>();

  const faqs1 = [t("modal.modalDeposit.steps1.question1")];
  const faqs2 = [t("modal.modalDeposit.steps1.question2")];

  const methodRecommend = Form.useWatch("methodRecommend", form);
  const methodOther = Form.useWatch("methodOther", form);

  const items: TabsProps["items"] = [
    {
      key: ETabSelectPaymentMethod.recommend,
      label: t("modal.modalDeposit.steps1.recommended"),
      children: (
        <div className={styles["recommendTab"]}>
          <Form.Item<ICommentForm> name="methodRecommend">
            <Radio.Group>
              <RadioItem
                key={radioPaymentMethods(t)[2].value}
                {...radioPaymentMethods(t)[2]}
                icon={metamask_logo}
              />
            </Radio.Group>
          </Form.Item>
        </div>
      ),
    },
    {
      key: ETabSelectPaymentMethod.otherMethod,
      label: t("modal.modalDeposit.steps1.otherMethod"),
      children: (
        <div className={styles["otherTab"]}>
          <Form.Item<ICommentForm> name="methodOther">
            <Radio.Group name="method" disabled>
              {radioPaymentMethods(t).map(
                (radio, index) =>
                  index !== INTERNAL_METHOD_OPTION_INDEX && (
                    <RadioItem key={radio.value} {...radio} />
                  )
              )}
            </Radio.Group>
          </Form.Item>
        </div>
      ),
    },
  ];

  const addTokenToWallet = async () => {
    const chainId = (window.ethereum as any)?.chainId;

    if (chainId !== BSCChain.chainId) {
      try {
        await window.ethereum?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSCChain.chainId }],
        });
      } catch (switchNetwordError: any) {
        if (switchNetwordError.code === 4902) {
          try {
            await window.ethereum?.request({
              // @ts-expect-error
              method: "wallet_addEthereumChain",
              params: [BSCChain],
            });

            await window.ethereum?.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: BSCChain.chainId }],
            });
          } catch (addNetworkError) {
            return handleWeb3RequestError(t, addNetworkError);
          }
        } else {
          return handleWeb3RequestError(t, switchNetwordError);
        }
      }
    }

    const currencyId: number = form.getFieldValue("currency");
    const selectedCurrency = listCurrency.find(
      (currency) => currency.id === currencyId
    );

    if (!selectedCurrency) {
      notification.error({
        message: t("modal.modalDeposit.steps1.Not select currency"),
      });

      return;
    }

    try {
      const isSuccess = await window.ethereum?.request({
        // @ts-expect-error
        method: "wallet_watchAsset",
        params: {
          // @ts-expect-error
          type: "ERC20",
          options: {
            address: selectedCurrency.address,
            symbol: selectedCurrency.symbol,
            decimals: selectedCurrency.decimal,
            image: selectedCurrency.symbolImage,
          },
        },
      });

      if (!isSuccess) {
        notification.error({
          message: t("modal.modalDeposit.steps1.An error has occur"),
        });

        return;
      }

      notification.success({
        message: t("modal.modalDeposit.steps1.Add token success"),
      });
    } catch (error) {
      return handleWeb3RequestError(t, error);
    }
  };

  const onFinish = (data: ICommentForm) => {
    onContinue({
      ...data,
      method: data.methodOther ? data.methodOther : data.methodRecommend,
    });
  };

  useEffect(() => {
    if (methodRecommend && activeTab === ETabSelectPaymentMethod.recommend) {
      form.setFields([
        {
          name: "methodOther",
          value: "",
        },
      ]);
    } else if (
      methodOther &&
      activeTab === ETabSelectPaymentMethod.otherMethod
    ) {
      form.setFields([
        {
          name: "methodRecommend",
          value: "",
        },
      ]);
    }
  }, [activeTab, form, methodOther, methodRecommend]);

  return (
    <div className={styles["modalDeposit__selectCurrency"]}>
      <div className={styles["modalDeposit__selectCurrency-wrapper"]}>
        <div className={styles["currency"]}>
          <Form<ICommentForm>
            onFinish={onFinish}
            initialValues={{
              currency: listCurrency[0]?.id ?? "",
              methodOther: dataForm.method,
              methodRecommend: dataForm.method,
            }}
            form={form}
          >
            <div>
              <p className={styles["title"]}>
                {t("modal.modalDeposit.steps1.currency")}
              </p>
              <Form.Item<ICommentForm>
                name="currency"
                rules={[
                  {
                    required: true,
                    message: t("modal.modalDeposit.errors.currency"),
                  },
                ]}
              >
                <HPSelect
                  placeholder={t("modal.modalDeposit.steps1.Select a currency")}
                  options={listCurrency.map((item) => {
                    return {
                      label: (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            columnGap: 4,
                          }}
                        >
                          <img src={item.symbolImage} width={18} height={18} />
                          <span>{item.symbol}</span>
                        </div>
                      ),
                      value: item.id,
                    };
                  })}
                />
              </Form.Item>
              <div>
                <div
                  className={styles["modalDeposit__selectCurrency__add-token"]}
                  onClick={addTokenToWallet}
                >
                  <PlusOutlined />{" "}
                  {t("modal.modalDeposit.steps1.Add token to wallet")}
                </div>
              </div>
            </div>
            <div className={styles["wrapDeposit"]}>
              <p className={styles["title"]}>
                {t("modal.modalDeposit.steps1.depositWith")}{" "}
              </p>
              <Tabs
                activeKey={activeTab}
                defaultActiveKey={activeTab}
                items={items}
                onChange={(activeKey: string) =>
                  setActiveTab(activeKey as ETabSelectPaymentMethod)
                }
              />
            </div>
            <HPButton className="btn" htmlType="submit" title="Continue" />
          </Form>
        </div>
        <div className={styles["faqs"]}>
          <p className={styles["faqs__title"]}>FAQs</p>
          <Select
            defaultValue={faqs1[0]}
            options={faqs1.map((province) => ({
              label: province,
              value: province,
            }))}
            suffixIcon={<img src={dropDownIcon} />}
          />
          <Select
            defaultValue={faqs2[0]}
            options={faqs2.map((province) => ({
              label: province,
              value: province,
            }))}
            suffixIcon={<img src={dropDownIcon} />}
          />
        </div>
      </div>
    </div>
  );
}

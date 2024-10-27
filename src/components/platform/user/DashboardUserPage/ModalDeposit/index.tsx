import {
  ESocketAction,
  IPayloadListenSocket,
  SocketEvent,
} from "@/app/constants/socket";
import store from "@/app/store";
import { useSocket } from "@/app/useSocket";
import HPModal from "@/components/common/HPModal";
import HPSteps from "@/components/common/HPSteps";
import { userActions } from "@/features/user/userSlice";
import { StepProps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import EnterAmountStep from "./EnterAmountStep";
import ModalSuccessStep from "./ModalSuccessStep";
import SelectCurrencyStep from "./SelectCurrencyStep";
import styles from "./style.module.scss";

export enum EStepModalDeposit {
  First = 0,
  Second = 1,
  Third = 2,
}

export enum EMethodDeposit {
  Metamask = "Metamask",
  BankTransfer = "BankTransfer",
  BankCard = "BankCard",
}

export interface IDataDepositForm {
  method: EMethodDeposit;
  currency: number;
}

type IProps = {
  open: boolean;
  isAdmin: boolean;
  loading: boolean;
  onClose: () => void;
  handleDeposit: (amount: number) => Promise<boolean | undefined>;
  setProcessingDeposit: (value: boolean) => void;
  onDepositSuccess: () => void;
};

export default function ModalDeposit({
  open,
  loading,
  isAdmin,
  onClose,
  handleDeposit,
  onDepositSuccess,
  setProcessingDeposit,
}: IProps) {
  const { t } = useTranslation();
  const { registerListener, unregisterListener } = useSocket();

  const itemStep: StepProps[] = [
    {
      title: t("modal.modalDeposit.steps1.title"),
    },
    {
      title: t("modal.modalDeposit.steps2.title"),
    },
    {
      title: t("modal.modalDeposit.steps3.title"),
    },
  ];

  const [activeStep, setActiveStep] = useState<number>(EStepModalDeposit.First);
  const [dataForm, setDataForm] = useState({
    method: EMethodDeposit.Metamask,
    currency: 0,
  });

  const handleContinue = async (stepNumber: number, data: any) => {
    setDataForm({ ...dataForm, ...data });
    if (stepNumber === EStepModalDeposit.Second) {
      const isSuccess = await handleDeposit(Number(data));

      if (isSuccess) {
        setProcessingDeposit(false);
        setActiveStep(EStepModalDeposit.Third);
        onDepositSuccess();
      }
    } else {
      setActiveStep(stepNumber + 1);
    }
  };
  const handlePrevious = (stepNumber: number) => {
    setActiveStep(stepNumber - 1);
  };

  const renderStep = (activeStep: number) => {
    switch (activeStep) {
      case EStepModalDeposit.Second:
        return (
          <EnterAmountStep
            onContinue={(data) =>
              handleContinue(EStepModalDeposit.Second, data)
            }
            isAdmin={isAdmin}
            onPrevious={() => handlePrevious(EStepModalDeposit.Second)}
            dataForm={dataForm}
            loadingBtn={loading}
          />
        );
      case EStepModalDeposit.Third:
        return <ModalSuccessStep isAdmin={isAdmin} onClose={onClose} />;
      default:
        return (
          <SelectCurrencyStep
            onContinue={(data) => handleContinue(EStepModalDeposit.First, data)}
            dataForm={dataForm}
          />
        );
    }
  };

  useEffect(() => {
    registerListener(
      SocketEvent.events,
      async (socket: IPayloadListenSocket) => {
        if (!socket) return;
        if (socket.action === ESocketAction.DEPOSIT) {
          if (!isAdmin) {
            store.dispatch(userActions.getUserInfoRequest());
          }

          onDepositSuccess();
          toast.success(
            t("dashboardUser.deposit.depositSuccess", {
              amount: socket.data.amount,
            })
          );
        }
      }
    );
    return () => {
      unregisterListener(SocketEvent.events, () => {});
    };
  }, [
    registerListener,
    unregisterListener,
    t,
    isAdmin,
    setProcessingDeposit,
    onDepositSuccess,
  ]);

  return (
    <HPModal open={open} onClose={onClose} footer={""} width={"768px"}>
      <div className={styles["modalDeposit"]}>
        <HPSteps
          activeStep={activeStep}
          dataStep={itemStep}
          className={styles.modelDeposit__steps}
        />
        <div>{renderStep(activeStep)}</div>
      </div>
    </HPModal>
  );
}

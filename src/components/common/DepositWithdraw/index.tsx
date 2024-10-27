import TokenUSDTAbi from "@/app/abi/tokenUSDT.json";
import TreasuryPlatformAbi from "@/app/abi/treasuryPlatform.json";
import { checkErrorContract } from "@/app/common/checkErrorContract";
import {
  ESocketAction,
  IPayloadListenSocket,
  SocketEvent,
} from "@/app/constants/socket";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { AMOUNT_APPROVE, GAS_LIMIT_TRANSACTION } from "@/app/mock/config";
import store from "@/app/store";
import { useSocket } from "@/app/useSocket";
import IconDeposit from "@/assets/icons/icon_deposit.svg";
import IconWithdraw from "@/assets/icons/icon_withdraw.svg";
import ModalDeposit from "@/components/platform/user/DashboardUserPage/ModalDeposit";
import ModalWithdraw from "@/components/platform/user/DashboardUserPage/ModalWithdraw";
import { userActions } from "@/features/user/userSlice";
import { Button } from "antd";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Address,
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import {
  FetchBalanceResult,
  fetchBalance,
  readContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";

type Props = {
  withdrawLimit?: number;
  isAdmin?: boolean;
  totalBalance?: number;
  onDepositSuccess?: () => void;
};

const MAX_WAIT_BLOCK = 6;

export default function DepositWithdraw({
  withdrawLimit,
  totalBalance = 0,
  isAdmin = false,
  onDepositSuccess,
}: Props) {
  const { t } = useTranslation();
  const { address } = useAccount();
  const [decimals, setDecimals] = useState<number>();
  const { user } = useAppSelector((state) => state.user);
  const [processingDeposit, setProcessingDeposit] = useState<boolean>(false);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [openModalWithdraw, setOpenModalWithdraw] = useState<boolean>(false);
  const [openModalDeposit, setOpenModalDeposit] = useState<boolean>(false);

  const { registerListener, unregisterListener } = useSocket();
  const dispatch = useAppDispatch();

  const getDecimals = async () => {
    try {
      const decimal = (await readContract({
        address: process.env.REACT_APP_CONTRACT_USDT_HP as Address,
        abi: TokenUSDTAbi,
        functionName: "decimals",
      })) as ethers.BigNumber;

      setDecimals(decimal.toNumber());
    } catch (error) {
      console.log("Get decimal error: ");
      console.dir(error);
    }
  };

  const { connectAsync, connectors } = useConnect({
    onSuccess() {
      // signMessage({ message: `happy365#${timeStamp}` });
    },
  });

  const connectWallet = async (index: number) => {
    if (typeof window.ethereum === "undefined" && index === 0) {
      window.open("https://metamask.io/download/");
    } else {
      const data: { account: Address; chain: { id: number } } =
        await connectAsync({
          connector: connectors[index],
        });
      return data;
    }
  };

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED),
  });

  const getBalance = useCallback(async () => {
    if (!address) return;
    const balanceToken: FetchBalanceResult = await fetchBalance({
      address,
      chainId: Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED),
      token: process.env.REACT_APP_CONTRACT_USDT_HP as Address,
    });
    dispatch(userActions.getBalanceSuccess(Number(balanceToken.formatted)));
  }, [address, dispatch]);

  const checkConnect = async () => {
    if (!address) {
      try {
        const data = await connectWallet(0);
        return data;
      } catch (error: any) {
        if (error.cause.code === 4001) {
          toast.error(t("toastErrorCommon.Message-1.5"));
        } else {
          checkErrorContract(t, error);
        }
        return;
      }
    }
  };

  const checkNetWorkWrong = async () => {
    if (chain?.id !== Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED)) {
      await switchNetworkAsync?.(
        Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED)
      );
    }
  };

  const getAllowance = async () => {
    if (!decimals) return;

    const allowance = (await readContract({
      address: process.env.REACT_APP_CONTRACT_USDT_HP as Address,
      abi: TokenUSDTAbi,
      args: [address, process.env.REACT_APP_CONTRACT_TREASURY as Address],
      functionName: "allowance",
    })) as ethers.BigNumber;

    return allowance;
  };

  const depositToken = async (amount: number | string) => {
    const tokenUSDTAddress = process.env.REACT_APP_CONTRACT_USDT_HP as Address;
    if (!user) return;
    try {
      const data = await writeContract({
        address: process.env.REACT_APP_CONTRACT_TREASURY as Address,
        mode: "recklesslyUnprepared",
        abi: TreasuryPlatformAbi,
        functionName: "deposit",
        args: [tokenUSDTAddress, user.id, amount],
        chainId: Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED),
        overrides: { gasLimit: GAS_LIMIT_TRANSACTION as any },
      });

      if (data.hash) {
        toast.info(t("dashboardUser.balance.msgDepositProcessing"));

        return data;
      } else {
        setProcessingDeposit(false);
        toast.error(t("dashboardUser.balance.msgDepositError"));
      }
    } catch (error) {
      console.log("depositToken error: ", error);

      checkErrorContract(t, error);
    }
  };

  const handleApprove = async (amount: string) => {
    const tokenUSDTAddress = process.env.REACT_APP_CONTRACT_USDT_HP as Address;
    const treasuryAddress = process.env.REACT_APP_CONTRACT_TREASURY as Address;
    if (!address) return;

    const data = await writeContract({
      address: tokenUSDTAddress,
      mode: "recklesslyUnprepared",
      abi: TokenUSDTAbi,
      functionName: "approve",
      args: [treasuryAddress, amount],
      chainId: Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED),
      overrides: { gasLimit: GAS_LIMIT_TRANSACTION as any },
    });
    if (!data.hash) {
      toast.error(t("dashboardUser.balance.msgApproveError"));
    }
    await waitForTransaction({
      confirmations: MAX_WAIT_BLOCK,
      hash: data.hash,
    });

    return await getAllowance();
  };

  const handleDeposit = async (amount: number) => {
    if (!decimals) return;
    setProcessingDeposit(true);
    try {
      await checkNetWorkWrong();

      const tokenAllowance = await getAllowance();
      const convertedAmount = ethers.utils.parseUnits(String(amount), decimals);

      if (tokenAllowance?.gte(convertedAmount)) {
        const sendTxResult = await depositToken(convertedAmount.toHexString());
        if (sendTxResult) {
          const txResult = await sendTxResult.wait(1);

          return txResult.status === 1;
        }
      } else {
        try {
          if (tokenAllowance?.gt(0)) {
            await handleApprove("0");
          }

          const updatedAllowance = await handleApprove(
            AMOUNT_APPROVE.toHexString()
          );

          if (updatedAllowance?.gte(convertedAmount)) {
            const sendTxResult = await depositToken(
              convertedAmount.toHexString()
            );
            if (sendTxResult) {
              const txResult = await sendTxResult.wait(1);

              return txResult.status === 1;
            }
          }
        } catch (error: any) {
          console.log("Approve error: ", error);

          checkErrorContract(t, error);
        }
      }
    } catch (error) {
      console.log("handleDeposit error: ", error);
      checkErrorContract(t, error);
    } finally {
      setProcessingDeposit(false);
    }
  };

  const handleWithdrawal = () => {
    setIsProcessingWithdraw(true);
    setOpenModalWithdraw(true);
  };

  const handleClickBtnDeposit = async () => {
    if (!address) {
      const data = await checkConnect();
      if (data) {
        setOpenModalDeposit(true);
      }
    } else {
      setOpenModalDeposit(true);
    }
  };

  const depositSuccessHandler = useCallback(() => {
    if (onDepositSuccess) {
      onDepositSuccess();
    } else {
      getBalance();
    }
  }, [getBalance, onDepositSuccess]);

  useEffect(() => {
    if (openModalDeposit) return;
    registerListener(
      SocketEvent.events,
      async (socket: IPayloadListenSocket) => {
        if (!socket) return;
        if (socket.action === ESocketAction.DEPOSIT) {
          setProcessingDeposit(false);
          store.dispatch(userActions.getUserInfoRequest());
          await getBalance();
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
  }, [getBalance, openModalDeposit, registerListener, t, unregisterListener]);

  useEffect(() => {
    getDecimals();
    store.dispatch(userActions.getInfoWithdrawToDayRequest());
  }, []);

  return (
    <>
      <Button
        className="ant-btn-custom"
        onClick={handleClickBtnDeposit}
        disabled={processingDeposit}
        loading={processingDeposit}
      >
        <img src={IconDeposit} alt="" />
        <span> {t("dashboardUser.balance.btnDeposit")}</span>
      </Button>
      <Button onClick={handleWithdrawal}>
        <img src={IconWithdraw} alt="" />
        <span> {t("dashboardUser.balance.btnWithdraw")}</span>
      </Button>
      {openModalWithdraw && (
        <ModalWithdraw
          open={openModalWithdraw}
          overideBalance={totalBalance}
          isAdmin={isAdmin}
          onClose={() => {
            setOpenModalWithdraw(false);
          }}
        />
      )}
      {openModalDeposit && (
        <ModalDeposit
          isAdmin={isAdmin}
          open={openModalDeposit}
          onClose={() => setOpenModalDeposit(false)}
          handleDeposit={(amount) => handleDeposit(amount)}
          loading={processingDeposit}
          onDepositSuccess={depositSuccessHandler}
          setProcessingDeposit={(value) => setProcessingDeposit(value)}
        />
      )}
    </>
  );
}

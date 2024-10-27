import { takeDecimalNumber } from "@/app/common/helper";
import IconDeposit from "@/assets/icons/icon_deposit.svg";
import IconWithdraw from "@/assets/icons/icon_withdraw.svg";
import { Button, Col, Row } from "antd";
import style from "./style.module.scss";
import { useAppSelector } from "@/app/hooks";
import { useCallback, useEffect, useState } from "react";
import DepositWithdraw from "@/components/common/DepositWithdraw";
import { adminService } from "@/service/adminService";
import { useSocket } from "@/app/useSocket";
import {
  ESocketAction,
  IPayloadListenSocket,
  SocketEvent,
} from "@/app/constants/socket";
import { useTranslation } from "react-i18next";
import { readContract } from "wagmi/actions";
import { Address } from "wagmi";
import TokenUSDTAbi from "@/app/abi/tokenUSDT.json";
import { convertToDecimal } from "@/app/formatBigNmber";
type Props = {};

const address = process.env.REACT_APP_CONTRACT_TREASURY;

export default function EstimateBalance() {
  const { t } = useTranslation();
  const [adminBalance, setAdminBalance] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>();
  const [balance, setBalance] = useState();

  const { registerListener, unregisterListener } = useSocket();

  const fetchAdminBalance = async () => {
    const res = await adminService.getAdminBalance();
    setAdminBalance(res.data);
  };

  const getDecimals = async () => {
    const decimal = await readContract({
      address: process.env.REACT_APP_CONTRACT_USDT_HP as Address,
      abi: TokenUSDTAbi,
      functionName: "decimals",
    });
    setDecimals(Number(decimal));
  };

  const getTotalDeposit = async () => {
    const balances: any = await readContract({
      address: process.env.REACT_APP_CONTRACT_USDT_HP as Address,
      abi: TokenUSDTAbi,
      args: [address],
      functionName: "balanceOf",
    });
    setBalance(balances?._hex);
  };

  const depositSuccessHandler = useCallback(() => {
    getTotalDeposit();
    fetchAdminBalance();
  }, []);

  useEffect(() => {
    getDecimals();
    getTotalDeposit();
    fetchAdminBalance();
  }, []);

  useEffect(() => {
    registerListener(
      SocketEvent.events,
      async (socket: IPayloadListenSocket) => {
        if (!socket) return;
        if (socket.action === ESocketAction.WITHDRAW) {
          fetchAdminBalance();
        }
      }
    );
    return () => {
      unregisterListener(SocketEvent.events, () => {});
    };
  }, [registerListener, unregisterListener]);

  return (
    <div className={style.estimateBalance}>
      <div className={style.header}>
        <span className={style.title}>{t("estimateBalance.title")}</span>
        <div className={style.action}>
          <DepositWithdraw
            totalBalance={adminBalance}
            isAdmin
            onDepositSuccess={depositSuccessHandler}
          />
        </div>
      </div>
      <Row gutter={[30, 0]}>
        <Col span={12}>
          <div className={style.content}>
            <p>{t("estimateBalance.totalMoneyDeposit")}</p>
            <div className={style.dollar}>
              $
              {takeDecimalNumber(
                Number(convertToDecimal(Number(balance), Number(decimals))) ||
                  0,
                4
              )}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={style.content}>
            <p>{t("estimateBalance.adminBalance")}</p>
            <div className={style.dollar}>
              ${takeDecimalNumber(adminBalance ?? 0, 6)}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

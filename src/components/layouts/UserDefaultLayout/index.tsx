import { ERoutePath } from "@/app/constants/path";
import { KEY } from "@/app/constants/request";
import {
  ESocketAction,
  IPayloadNotifySocket,
  SocketEvent,
} from "@/app/constants/socket";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/useSocket";
import { cartAction } from "@/features/cart/cartSlice";
import { userActions } from "@/features/user/userSlice";
import { EOrderStatus } from "@/interfaces/order";
import { EUserRole } from "@/interfaces/user";
import { notification } from "antd";
import { t } from "i18next";
import { useEffect, useRef } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import dayjs from "dayjs";
import { EFormatDate } from "@/app/common/formatDate";
import {
  DEFAULT_CONDITION_ALERTS,
  alertActions,
} from "@/features/alert/alertSlice";

import style from "./style.module.scss";
import HPAppHeader from "@/components/platform/app/Header";
import HPAppFooter from "@/components/platform/app/Footer";

export default function UserDefaultLayout() {
  const appLayoutRef = useRef<any>(null);
  useEffect(() => {
    appLayoutRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [appLayoutRef]);

  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { registerListener, unregisterListener } = useSocket();

  const [api, contextHolder] = notification.useNotification();

  const renderStatusOrder = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.CANCELED:
        return t("notifyAlert.order.textCanceled");
      case EOrderStatus.FULFILLED:
        return t("notifyAlert.order.textFulfilled");
      case EOrderStatus.PROCESSING:
        return t("notifyAlert.order.textProcessing");
      case EOrderStatus.SHIPPING:
        return t("notifyAlert.order.textShipping");
      default:
        return t("notifyAlert.order.textCreated");
    }
  };

  const messageNotify = (
    socket: IPayloadNotifySocket
  ): {
    message?: JSX.Element | string;
    description?: JSX.Element | string;
  } => {
    const { action, data } = socket;
    if (action === ESocketAction.REP_SIGNUP) {
      return {
        description: (
          <>
            {t("notifyAlert.newCustomer.content", {
              name: data?.name,
              email: data?.email,
            })}
            <span
              onClick={() => navigate(ERoutePath.MY_ALERTS)}
              className="link"
            >
              {t("notifyAlert.textViewDetail")}
            </span>
          </>
        ),
        message: t("notifyAlert.newCustomer.title"),
      };
    } else if (action === ESocketAction.REP_ORDER) {
      return {
        description: (
          <>
            {t("notifyAlert.order.content", {
              id: data.id,
              date: dayjs(data.createdAt).format(EFormatDate["DD/MM/YYYY"]),
            })}
            {renderStatusOrder(data?.status || 0)}.{" "}
            <span
              onClick={() =>
                navigate(`${ERoutePath.MY_ORDER}?orderId=${data.id}`)
              }
              className="link"
            >
              {t("notifyAlert.textViewDetail")}
            </span>
            ,
          </>
        ),
        message: (
          <>
            {t("notifyAlert.order.title")}
            {renderStatusOrder(data?.status || 0)}
          </>
        ),
      };
    } else {
      return {
        message: "",
        description: "",
      };
    }
  };

  useEffect(() => {
    if (!user?.role) return;
    if (user.role === EUserRole.admin || user.role === EUserRole.employee) {
      navigate(ERoutePath.ADMIN_DASHBOARD);
    }
  }, [navigate, user?.role]);

  useEffect(() => {
    const token = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (!token) return;
    dispatch(userActions.getInfoMySponsorRequest());
    dispatch(cartAction.getCartInfoRequest());
    dispatch(userActions.getUserShippingRequest());
  }, [dispatch, navigate]);

  useEffect(() => {
    registerListener(
      SocketEvent.events,
      async (socket: IPayloadNotifySocket) => {
        if (!socket) return;
        if (
          socket.action === ESocketAction.REP_SIGNUP ||
          socket.action === ESocketAction.REP_ORDER
        ) {
          const { description, message } = messageNotify(socket);
          dispatch(alertActions.getListAlertsRequest(DEFAULT_CONDITION_ALERTS));
          api.info({
            message,
            description,
            placement: "bottomRight",
            className: style.notify,
            duration: 5,
          });
        }
      }
    );
    return () => {
      unregisterListener(SocketEvent.events, () => {});
    };
  }, [api, registerListener, unregisterListener]);

  return (
    <div ref={appLayoutRef} className={style.appLayout}>
      {contextHolder}
      <HPAppHeader />
      <div className={style.children}>
        <Outlet />
      </div>
      <HPAppFooter />
    </div>
  );
}

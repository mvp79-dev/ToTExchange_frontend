import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Address, useAccount, useBalance } from "wagmi";
import { FetchBalanceResult, fetchBalance } from "wagmi/actions";
import { KEY } from "./app/constants/request";
import { ERoomSocket } from "./app/constants/socket";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useSocket } from "./app/useSocket";
import { appActions } from "./features/app/appSlice";
import { userActions } from "./features/user/userSlice";
import { EUserRole } from "./interfaces/user";
import { AppRouter } from "./routes";
import { AdminRoute } from "./routes/AdminRoute";

function App() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { socket, status } = useSocket();

  const getBalance = useCallback(async () => {
    if (!address) return;
    const balanceToken: FetchBalanceResult = await fetchBalance({
      address: address as Address,
      chainId: Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED),
      token: process.env.REACT_APP_CONTRACT_USDT_HP as Address,
    });
    dispatch(userActions.getBalanceSuccess(Number(balanceToken.formatted)));
  }, [address, dispatch]);

  const { data: balanceNetwork } = useBalance({
    address: address,
    chainId: Number(process.env.REACT_APP_CHAIN_ID_SUPPORTED),
  });

  useEffect(() => {
    if (!balanceNetwork) return;
    dispatch(userActions.getBalanceNetworkSuccess(balanceNetwork));
  }, [dispatch, balanceNetwork]);

  useEffect(() => {
    function getUserInfo() {
      const token = localStorage.getItem(KEY.ACCESS_TOKEN);
      if (!token) return;
      dispatch(userActions.getUserInfoRequest());
    }
    getUserInfo();
    dispatch(appActions.getListCategoryRequest());
    dispatch(appActions.getListCurrencyRequest());
    dispatch(appActions.getUserConfigsRequest());
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    if (status === "connected") {
      socket?.emit(ERoomSocket.joinRoom, `${ERoomSocket.user}-${user?.id}`);
    }
    return () => {
      socket?.emit(ERoomSocket.leaveRoom, `${ERoomSocket.user}-${user?.id}`);
    };
  }, [status, user?.id]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    function removeDuplicateToastContainer() {
      const toastContainerList = document.getElementsByClassName("Toastify");
      for (let index = 1; index < toastContainerList.length; index++) {
        const element = toastContainerList[index];
        element.remove();
      }
    }
    window.addEventListener("load", removeDuplicateToastContainer);
  }, []);

  return (
    <>
      {user?.role === EUserRole.admin || user?.role === EUserRole.employee ? (
        <AdminRoute />
      ) : (
        <AppRouter />
      )}
    </>
  );
}

export default App;

import { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { userActions } from "../../features/user/userSlice";
import { ERoutePath } from "../constants/path";
import { KEY, MESSAGE_ERROR } from "../constants/request";
import { myHistory } from "../myHistory";
import store from "../store";
import { authServices } from "@/service/authServices";

const msgCallback = (msg: string) => {
  toast.error(msg);
};

let timeoutFlag: NodeJS.Timeout;
let refreshAccessTokenRequest: Promise<any[]> | undefined = undefined;

export const handleErrorUtil = async (
  response: AxiosResponse<any>,
  instance: AxiosInstance
) => {
  const { status } = response;
  if (status >= 500) {
    clearTimeout(timeoutFlag);
    timeoutFlag = setTimeout(
      () => msgCallback(MESSAGE_ERROR.SERVICE_ERROR),
      1500
    );
    return;
  }

  switch (status) {
    case 401: {
      let res, error;

      if (!refreshAccessTokenRequest) {
        const refreshToken = localStorage.getItem(KEY.REFRESH_TOKEN);
        const accessToken = localStorage.getItem(KEY.ACCESS_TOKEN);
        refreshAccessTokenRequest = authServices.refreshToken({
          oldAccessToken: accessToken ?? "",
          oldRefreshToken: refreshToken ?? "",
        });
      }

      [res, error] = await refreshAccessTokenRequest;
      refreshAccessTokenRequest = undefined;
      if (error) {
        await store.dispatch(userActions.logoutAccountSuccess());
        localStorage.removeItem(KEY.ACCESS_TOKEN);
        localStorage.removeItem(KEY.REFRESH_TOKEN);
        myHistory.replace(ERoutePath.LOGIN);
        clearTimeout(timeoutFlag);
        timeoutFlag = setTimeout(
          () => msgCallback(MESSAGE_ERROR.UNAUTHORIZE),
          1500
        );
        return;
      } else {
        const { refreshToken, accessToken } = res.data;
        localStorage.setItem(KEY.ACCESS_TOKEN, accessToken);
        localStorage.setItem(KEY.REFRESH_TOKEN, refreshToken);
        const newRequest = await instance.request(response.config);
        return newRequest;
      }
    }
    default:
      return Promise.reject(response);
  }
};

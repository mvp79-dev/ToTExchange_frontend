import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { handleErrorUtil } from "../../app/common/handle-error-request";
import { KEY } from "../../app/constants/request";

// eslint-disable-next-line no-redeclare
class Request {
  instance;
  constructor() {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    instance.interceptors.request.use(
      async (config: any) => {
        const accessToken = localStorage.getItem(KEY.ACCESS_TOKEN);
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error: AxiosError) => {
        Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      function (response: AxiosResponse) {
        return response;
      },
      function (error: AxiosError) {
        if (error.response) {
          return handleErrorUtil(error.response, instance);
        }
        return Promise.reject(error);
      },
    );

    this.instance = instance;
  }

  get = (url: string, params?: object) => {
    return this.instance.get(url, { params });
  };

  post = (url: string, data?: object, config?: AxiosRequestConfig) => {
    return this.instance.post(url, data, config);
  };

  put = (url: string, data?: object, config?: AxiosRequestConfig) => {
    return this.instance.put(url, data, config);
  };

  patch = (url: string, data: object) => {
    return this.instance.patch(url, data);
  };

  delete = (url: string, data?: object) => {
    return this.instance.delete(url, { data });
  };
}

export default new Request();

import { EDirectionType, EUserRole, IUserInfo } from "@/interfaces/user";
import request from "./request";

export interface IBodyLogin {
  userName: string;
  password: string;
}

export interface IBodyRegister {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userName: string;
  refCode: string;
  userType: EUserRole;
  direction: EDirectionType;
}

export interface IBodyVerifyOTP {
  otp: number;
  normalToken: string;
}

export interface IBodyRefreshToken {
  oldAccessToken: string;
  oldRefreshToken: string;
}

export interface IBodyForgetPassword {
  password: string;
  normalToken: string;
}

export enum ETypeRequestSendOTP {
  reset_password = "reset_password",
  confirm_withdraw = "confirm_withdraw",
  verify = "verify",
}

export interface IDataLogin {
  user: IUserInfo;
  accessToken: string;
  refreshToken: string;
}

export enum EMessVerifyOTP {
  wrong = "OTP_WRONG",
  expires = "OTP_EXPIRES",
}

class AuthServices {
  async refreshToken(body: IBodyRefreshToken) {
    try {
      const res = await request.post(`/auth/refresh-access-token`, body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
  async login(body: IBodyLogin) {
    try {
      const res = await request.post(`/auth/sign-in`, body);
      return [res, null];
    } catch (error) {
      return [null, error];
    }
  }
  async register(body: IBodyRegister) {
    try {
      const res = await request.post(`/auth/signup`, body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
  async verifyOtp(body: IBodyVerifyOTP) {
    try {
      const res = await request.post(`/auth/verify-otp`, body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
  // email with reset_password
  // normalToken with login & register
  async requestResendOtp(body: {
    normalToken?: string;
    email?: string;
    type: ETypeRequestSendOTP;
  }) {
    try {
      const res = await request.post(`/auth/request-send-otp`, body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
  async forgetPassword(body: IBodyForgetPassword) {
    try {
      const res = await request.post(`/auth/forget-password`, body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export const authServices = new AuthServices();

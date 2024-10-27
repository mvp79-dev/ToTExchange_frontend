export const REGEX_INPUT_AMOUNT = /^\d+(\.\d{1,})?$/g;
export const REGEX_PHONE_NUMBER = /^\d{10}$/g;
export const REGEX_ACCOUNT_NAME = /^(?!_)(?!.*__)(?!.*_$)[a-zA-Z0-9_]{3,30}$/;
export const REGEX_PASSWORD =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/g;
export const REGEX_PASSWORD_COMMON = /^(?!.*(password|123456|admin)).*$/g;
export const REGEX_WALLET_ADDRESS = /^0x[a-fA-F0-9]{40}$/g;

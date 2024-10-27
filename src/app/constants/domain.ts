export enum ISubDomain {
  www = "www",
  partner = "partner",
}

export const domainApp = process.env.REACT_APP_DOMAIN as string;

export interface IAppDomain {
  subdomain: ISubDomain | string;
  main: boolean;
}

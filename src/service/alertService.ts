import { IAlert, IAlertCount } from "@/interfaces/alert";
import request from "./request";
import { IQuery } from "@/interfaces/common";

class AlertServices {
  async getListAlert(query: IQuery): Promise<IAlert[]> {
    const res = await request.get("/alert/me", query);
    return res?.data;
  }
  async getAlertCount(): Promise<IAlertCount[]> {
    const { data } = await request.get("/alert/me/count");
    return data?.data;
  }
}

export const alertService = new AlertServices();

import request from "./request";
import { IQuery, IResponseArray } from "@/interfaces/common";
import { IRequestWithdraw } from "@/interfaces/withdrawal";
import {
  IRecentlyActivityResponse,
  ITolaVolumeItem,
  IWithdrawItem,
} from "@/interfaces/admin";
import { EPackageTimeTypeParam } from "./chartService";

class AdminService {
  async getListTotalVolume(
    query: IQuery
  ): Promise<IResponseArray<ITolaVolumeItem>> {
    const { data } = await request.get("/admin/totalVolume-table", query);
    return data;
  }

  async getListWithdraw(query: IQuery): Promise<IResponseArray<IWithdrawItem>> {
    const { data } = await request.get("/admin/withdraw", query);
    return data;
  }

  async createWithdraw(
    form: Omit<IRequestWithdraw, "type" | "receiverEmail" | "receiverId">
  ): Promise<any> {
    try {
      const { data } = await request.post("/admin/withdraw", form);
      return [data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async updateStatusWithdrawRequest(
    id: number,
    isAccept: boolean
  ): Promise<any> {
    try {
      const res = await request.put(`/admin/withdraw/${id}`, {
        isAccept,
      });
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async getAdminBalance(): Promise<{
    code: number;
    message: string;
    meta: object;
    status: string;
    data: number;
  }> {
    const { data } = await request.get("/admin/balance");
    return data;
  }

  async getRecentlyActivity(
    packageTimeType: EPackageTimeTypeParam
  ): Promise<IRecentlyActivityResponse> {
    const { data } = await request.get("/admin/recently-activity", {
      packageTimeType,
    });
    return data;
  }
}
export const adminService = new AdminService();

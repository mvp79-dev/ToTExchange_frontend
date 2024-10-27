import { IContactInfoForm } from "@/components/platform/user/Profile/MyProfile/Modal/ModalEditContactInformation";
import { IQuery, IQuerySnapshot } from "@/interfaces/common";
import { ICurrency } from "@/interfaces/currency";
import { IInputReviewProduct } from "@/interfaces/product";
import { IDescendantNodeResponse } from "@/interfaces/referral";
import { IBodyUpdateProfile } from "@/interfaces/user";
import { IRequestWithdraw } from "@/interfaces/withdrawal";
import { AxiosResponse } from "axios";
import request from "./request";

class UserServices {
  async getUserInfo() {
    return await request.get(`/users/me`);
  }
  async findSponsor(code: string) {
    try {
      const res = await request.get(`/users/sponsor/${code}`);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
  async getMySponsor() {
    const res = await request.get("/users/my-enrollment-info");
    return res;
  }
  async addToCart(body: { itemId: number; quantity: number }) {
    try {
      const res = await request.post(`/carts`, body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
  async updateItemToCart(cartId: number, body: { quantity: number }) {
    try {
      const res = await request.put(`/carts/${cartId}`, body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
  async getListCurrency(): Promise<ICurrency[]> {
    const res = await request.get("/users/currency");
    return res?.data;
  }
  async requestWithdraw(body: IRequestWithdraw) {
    try {
      const res = await request.post("/user/withdraw/create-request", body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
  async updateProfile(body: IBodyUpdateProfile) {
    try {
      const res = await request.put("/users/edit-profile", body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async updateContactInfo(body: IContactInfoForm) {
    try {
      const res = await request.put("/users/edit-contact-info", body);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async uploadAvatar(form: FormData): Promise<[any, Error | null]> {
    try {
      const res = await request.put("/users/upload-image-profile", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }
  async getInfoMyNFT() {
    const res = await request.get("/users/my-nft");
    return res;
  }
  async getInfoWithdrawToDay() {
    const res = await request.get("/users/today-withdraw-amount");
    return res;
  }
  async reviewProduct(body: IInputReviewProduct) {
    try {
      const res = await request.post("/rating/create", body);
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async getDirectDescendants(
    parentId: number
  ): Promise<[{ data: IDescendantNodeResponse[] } | null, Error | null]> {
    try {
      const res: AxiosResponse<{ data: IDescendantNodeResponse[] }> =
        await request.get(`/users/get-direct-display-descendants/${parentId}`);
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async getActivityTimelines(params: IQuery) {
    try {
      const res = await request.get("/users/activity-timeline/me", params);
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async getCommissionsHistory(params: IQuery) {
    try {
      const res = await request.get("/users/commission-history", params);
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async getBusinessSnapshot(params: IQuerySnapshot) {
    try {
      const res = await request.get("/users/business-snapshot", params);
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async getTeamGrowthStatistics() {
    try {
      const res = await request.get("/users/team-growth-statisics");
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async getUserVisitorKey() {
    try {
      const res = await request.get("/visitors");
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async setUserVisitorKey(key: string) {
    try {
      const res = await request.post(
        "/visitors",
        {},
        {
          headers: {
            key: key,
          },
        }
      );
      return [res.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }
}

export const userServices = new UserServices();

import { ICategoryMenu } from "@/interfaces/category";
import request from "./request";
import { IUserConfig } from "@/interfaces/common";
import { AxiosResponse } from "axios";

class AppServices {
  async getListCategory(): Promise<ICategoryMenu[]> {
    const res = await request.get("/category");
    return res?.data;
  }
  async getUserConfigs(): Promise<IUserConfig> {
    const res = await request.get("/users/configs");
    return res?.data;
  }

  async uploadFile(form: FormData): Promise<[string | null, Error | null]> {
    try {
      const response: AxiosResponse<string> = await request.post(
        "/file-upload",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error as Error];
    }
  }
}

export const appServices = new AppServices();

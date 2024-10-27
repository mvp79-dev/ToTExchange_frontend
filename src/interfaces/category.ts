import { IProductDetails } from "./product";

export interface ICategoryChildren {
  id: number;
  name: string;
  parentId: number;
  product: IProductDetails[];
  imgUrl: string;
}
export interface ICategoryMenu extends Omit<ICategoryChildren, "product"> {
  children: ICategoryChildren[];
  count: number;
}

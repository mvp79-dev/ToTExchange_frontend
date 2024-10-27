import { IReviewProduct } from "@/interfaces/product";

export const checkIsUserReview = (data: IReviewProduct[], userId: number) => {
  const index = data.findIndex((item) => item.userId === userId);
  return index >= 0;
};

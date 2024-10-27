import { EKeyTranslations } from "@/interfaces/common";
import { IProductItem, IRating } from "../../interfaces/product";

export const transformLanguageData = (
  lang: EKeyTranslations,
  data: string
): string => {
  try {
    const result = JSON.parse(data);
    return result[lang];
  } catch (e) {
    return data;
  }
};

export const getTotalPriceProduct = (productList: IProductItem[]): number => {
  if (!productList.length) {
    return 0;
  }
  return productList.reduce((accumulator, product) => {
    return accumulator + product.price;
  }, 0);
};

export const getAverageRating = (ratings: IRating[]): number => {
  if (!ratings.length) {
    return 0;
  }
  const totalStars = ratings.reduce((accumulator, rating) => {
    return accumulator + rating.star;
  }, 0);
  const averageRating = totalStars / ratings.length;
  return Math.round(averageRating);
};

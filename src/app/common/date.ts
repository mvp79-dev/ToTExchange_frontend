import dayjs from "dayjs";
import { EFormatDate } from "./formatDate";

export const getPastDateEndOfDay = (numberDate: number) => {
  return dayjs(new Date()).subtract(numberDate, "days").endOf("days");
};

export const getLastDate = (array: any[]) => {
  if (!array.length) return "";
  array[0].created;
  return dayjs(array[0]?.createdAt).format(EFormatDate["HH:mm DD/MM/YYYY"]);
};

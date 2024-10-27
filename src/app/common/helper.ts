import BigNumberjs from "bignumber.js";
import { ISubDomain, domainApp } from "../constants/domain";

export function getDomain() {
  const subdomain = getSubdomain(window.location.hostname);
  return subdomain === "";
}

export function getSubdomain(location: string) {
  const locationParts = location.split(".");
  let sliceTill = -2;
  const isLocalhost =
    locationParts.slice(-1)[0] === "localhost" ||
    locationParts.slice(-1)[0] === ISubDomain.www;

  if (isLocalhost) sliceTill = -1;
  return location === domainApp
    ? ""
    : locationParts.slice(0, sliceTill).join("");
}

export function replaceEmails(text: string) {
  const pattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const replacedText = text.replace(pattern, function (match) {
    const parts = match.split("@");
    const username = parts[0];
    const domain = parts[1];
    const maskedUsername =
      username.substring(0, 3) +
      "*".repeat(username.length - 5) +
      username.substring(-2);
    return maskedUsername + "@" + domain;
  });

  return replacedText;
}

export const accuratelyTakeDecimalNumber = (num: number, n = 6) => {
  const decimalNumber = new BigNumberjs(10).exponentiatedBy(n);

  const result = new BigNumberjs(num)
    .multipliedBy(decimalNumber)
    .integerValue(BigNumberjs.ROUND_DOWN)
    .dividedBy(decimalNumber)
    .toNumber();
  return result;
};

export const takeDecimalNumber = (num: number, n = 6) => {
  let result = Math.trunc(num * Math.pow(10, n)) / Math.pow(10, n);
  return result;
};

export const truncateText = (address: string, first = 5, last = 4): string => {
  if (address && address.length > 0)
    return (
      address.trim().substring(0, first) +
      "..." +
      address.trim().substring(address.length - last)
    );
  return "";
};

export const getElapsedDuration = (completionDate: Date) => {
  const currentDate = new Date();

  const elapsedMilliseconds = Number(currentDate) - Number(completionDate);
  const elapsedDays = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));
  const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));

  const currentYear = currentDate.getFullYear();
  const completionYear = completionDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const completionMonth = completionDate.getMonth();

  let elapsedMonths =
    (currentYear - completionYear) * 12 + (currentMonth - completionMonth);
  if (currentDate.getDate() < completionDate.getDate()) {
    elapsedMonths -= 1;
  }

  const elapsedYears = Math.floor(elapsedMonths / 12);
  elapsedMonths %= 12;

  if (elapsedYears >= 1) {
    return `${elapsedYears} year ago`;
  } else if (elapsedMonths >= 1) {
    return `${elapsedMonths} moth ago`;
  } else if (elapsedDays >= 1) {
    return `${elapsedDays} day ago`;
  } else if (elapsedHours >= 1) {
    return `${elapsedHours} hour ago`;
  } else {
    return `${elapsedMinutes <= 0 ? 1 : elapsedMinutes} min ago`;
  }
};

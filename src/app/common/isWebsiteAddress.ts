const VALIDATE_WEBSITE_ADDRESS =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/;
const VALIDATE_WEBSITE_ADDRESS_WITH_HTTP =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/;

export const isWebsiteAddress = (str: string, startWithHttp = true) => {
  try {
    const url = new URL(str);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch (error) {
    const regex = startWithHttp
      ? VALIDATE_WEBSITE_ADDRESS_WITH_HTTP
      : VALIDATE_WEBSITE_ADDRESS;

    return regex.test(str);
  }
};

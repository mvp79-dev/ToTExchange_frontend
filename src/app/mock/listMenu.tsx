import { ERoutePath } from "@/app/constants/path";
import { EActiveTabGenealogy } from "@/components/platform/user/Genealogy";
import { IUserInfo } from "@/interfaces/user";
import { CaretDownOutlined } from "@ant-design/icons";
import { TFunction } from "i18next";
import { ReactNode } from "react";
import { createPath } from "react-router-dom";

interface IMenu {
  title: string | ReactNode;
  link: string;
  subMenu?: boolean | Array<{ label: string; key: string }>;
}
const subMenu = (t: TFunction<"translation", undefined>, user?: IUserInfo) => {
  if (!user?.isAdded) {
    return [
      {
        label: t("header.menu.about Happy365Global"),
        key: ERoutePath.ABOUT_US,
      },
      {
        label: t("header.menu.creator message"),
        key: ERoutePath.ABOUT_US_MESSAGE,
      },
    ];
  }
  return [
    {
      label: t("header.menu.about Happy365Global"),
      key: ERoutePath.ABOUT_US,
    },
    {
      label: t("header.menu.aiming"),
      key: ERoutePath.ABOUT_US_VISION,
    },
    {
      label: t("header.menu.creator message"),
      key: ERoutePath.ABOUT_US_MESSAGE,
    },
  ];
};

export const listAppMenuUser = (
  t: TFunction<"translation", undefined>,
  user?: IUserInfo
): IMenu[] => {
  return [
    {
      title: (
        <>
          {t("header.menu.about us")} <CaretDownOutlined />
        </>
      ),
      link: ERoutePath.ABOUT_US,
      subMenu: subMenu(t, user),
    },
    {
      title: (
        <>
          {t("header.menuUser.organization")} <CaretDownOutlined />
        </>
      ),
      link: ERoutePath.MY_GENEALOGY,
      subMenu: [
        {
          label: t("genealogy.textTreeView"),
          key: createPath({
            pathname: ERoutePath.MY_GENEALOGY,
            search: `type=${EActiveTabGenealogy.Tree}`,
          }),
        },
        {
          label: t("genealogy.textGraphicalView"),
          key: createPath({
            pathname: ERoutePath.MY_GENEALOGY,
            search: `type=${EActiveTabGenealogy.Graphical}`,
          }),
        },
      ],
    },
    {
      title: <>{t("header.menuUser.order")}</>,
      link: ERoutePath.MY_ORDER,
    },
    {
      title: <>{t("header.menuUser.commission")}</>,
      link: ERoutePath.MY_COMMISSION,
    },
    {
      title: <>Premium NFT</>,
      link: ERoutePath.MARKETPLACE,
    },
    {
      title: t("header.menuUser.shop"),
      link: ERoutePath.PRODUCTS,
      // subMenu: true,
    },
    {
      title: t("header.menu.news"),
      link: ERoutePath.NEWS,
      subMenu: [
        // {
        //   label: t("header.menu.newsHeath"),
        //   key: ERoutePath.NEWS_HEALTH,
        // },
        {
          label: t("header.menu.newsScience"),
          key: ERoutePath.NEWS_SCIENCE,
        },
      ],
    },
    {
      title: t("header.menuUser.contactUs"),
      link: ERoutePath.CONTACT_US,
    },
  ];
};

export const listMenuDefault = (
  t: TFunction<"translation", undefined>,
  user?: IUserInfo
): IMenu[] => {
  return [
    {
      title: <>{t("header.menu.home")} </>,
      link: ERoutePath.HOME,
    },
    {
      title: (
        <>
          {t("header.menu.about us")} <CaretDownOutlined />
        </>
      ),
      link: ERoutePath.ABOUT_US,
      subMenu: subMenu(t, user),
    },
    {
      title: t("header.menu.shop"),
      link: ERoutePath.PRODUCTS,
      // subMenu: true,
    },
    {
      title: (
        <>
          {t("header.menu.news")} <CaretDownOutlined />
        </>
      ),
      link: ERoutePath.NEWS,
      subMenu: [
        // {
        //   label: t("header.menu.newsHeath"),
        //   key: ERoutePath.NEWS_HEALTH,
        // },
        {
          label: t("header.menu.newsScience"),
          key: ERoutePath.NEWS_SCIENCE,
        },
      ],
    },
    {
      title: t("header.menu.contactUs"),
      link: ERoutePath.CONTACT_US,
    },
  ];
};

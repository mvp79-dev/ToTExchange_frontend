import { ERoutePath } from "@/app/constants/path";
import {
  BarChartOutlined,
  CaretDownOutlined,
  LineChartOutlined,
  PieChartFilled,
  PieChartOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, MenuProps, Space } from "antd";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./style.module.scss";
import LogoPlatform from "@/assets/icons/logo.png";
import { EKeyTranslations } from "@/interfaces/common";
import iconUSLanguage from "@/assets/icons/icon-us-language.svg";
import iconVietnamese from "@/assets/images/vietnamese.jpg";
import i18n from "@/i18n";
import { KEY } from "@/app/constants/request";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { EUserRole } from "@/interfaces/user";

type Props = {};

enum EKeySlideMenuAdmin {
  dashboard = ERoutePath.ADMIN_DASHBOARD,
  balanceTracking = ERoutePath.ADMIN_BALANCE_TRACKING,
  orders = ERoutePath.ADMIN_ORDERS,
  products = ERoutePath.ADMIN_PRODUCTS,
  salesReport = ERoutePath.ADMIN_SALES_REPORT,
  settings = ERoutePath.ADMIN_SETTINGS,
}

type MenuItem = Required<MenuProps>["items"][number];

interface MenuInfo {
  key: string;
  keyPath: string[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

const itemsLanguage: MenuProps["items"] = [
  {
    label: "Eng (US)",
    key: EKeyTranslations.en,
    icon: <img src={iconUSLanguage} alt="" />,
  },
  {
    label: "Vietnamese",
    key: EKeyTranslations.vi,
    icon: <img src={iconVietnamese} alt="" />,
  },
];
export const itemsMenuSlideAdmin = (
  t: TFunction<"translation", undefined>,
  role?: EUserRole
): MenuItem[] => {
  const menuList: MenuItem[] = [
    {
      label: t("adminMenuSlide.dashboard"),
      key: EKeySlideMenuAdmin.dashboard,
      icon: <PieChartFilled />,
      title: t("adminMenuSlide.dashboard"),
    },
  ];

  if (role === EUserRole.admin) {
    menuList.push({
      label: t("adminMenuSlide.Balance Tracking"),
      key: EKeySlideMenuAdmin.balanceTracking,
      icon: <BarChartOutlined />,
      title: t("adminMenuSlide.Balance Tracking"),
    });
  }

  menuList.push(
    {
      label: t("adminMenuSlide.Orders"),
      key: EKeySlideMenuAdmin.orders,
      icon: <ShoppingCartOutlined />,
      title: t("adminMenuSlide.Orders"),
    },
    {
      label: t("adminMenuSlide.Products"),
      key: EKeySlideMenuAdmin.products,
      icon: <ShoppingOutlined />,
      title: t("adminMenuSlide.Products"),
    },
    {
      label: t("adminMenuSlide.Sales Report"),
      key: EKeySlideMenuAdmin.salesReport,
      icon: <LineChartOutlined />,
      title: t("adminMenuSlide.Sales Report"),
    },
    {
      label: t("adminMenuSlide.Settings"),
      key: EKeySlideMenuAdmin.settings,
      icon: <SettingOutlined />,
      title: t("adminMenuSlide.Settings"),
    }
  );

  return menuList;
};

export default function SlideMenuAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const role = useAppSelector((state) => state.user.user?.role);

  const [keyLanguage, setKeyLanguage] = useState<EKeyTranslations>(
    (localStorage.getItem(KEY.I18N_LANGUAGE) as any) || EKeyTranslations.vi
  );

  const menuList = itemsMenuSlideAdmin(t, role);

  const selectedKey = menuList.find((el) =>
    location.pathname.includes(String(el?.key))
  );

  const handleClick = (info: MenuInfo) => {
    navigate(info.key);
  };

  const itemLanguage =
    keyLanguage &&
    itemsLanguage?.[
      itemsLanguage?.findIndex((item) => item && item.key === keyLanguage)
    ];
  const onChangeKeyI18n = (key: EKeyTranslations) => {
    i18n.changeLanguage(key);
    localStorage.setItem(KEY.I18N_LANGUAGE, key);
    setKeyLanguage(key);
  };

  const onClickLanguage: MenuProps["onClick"] = ({ key }) => {
    onChangeKeyI18n(key as EKeyTranslations);
  };

  return (
    <div className={style.slideMenu}>
      <div className={style.logo}>
        <img src={LogoPlatform} width={332} />
      </div>
      <Menu
        selectedKeys={[
          String(selectedKey?.key ?? EKeySlideMenuAdmin.dashboard),
        ]}
        mode="inline"
        //  inlineCollapsed thu nho slide-menu
        // inlineCollapsed={collapsed}
        items={menuList}
        onClick={handleClick}
      />
      <div className={style.changeLanguage}>
        <Dropdown
          menu={{
            items: itemsLanguage,
            onClick: onClickLanguage,
            className: "dropdownLanguage",
          }}
          trigger={["click"]}
          align={{
            offset: [0, 4],
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <div className={style.i18n}>
                {(itemLanguage as any)?.icon}
                <span className={style.title}>
                  {(itemLanguage as any)?.label}
                </span>
                <CaretDownOutlined />
              </div>
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}

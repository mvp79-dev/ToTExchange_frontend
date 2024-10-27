import { transformLanguageData } from "@/app/common/transformDataResponse";
import { listAppMenuUser, listMenuDefault } from "@/app/mock";
import {
  Button,
  Collapse,
  Divider,
  Dropdown,
  Input,
  Menu,
  MenuProps,
} from "antd";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  NavLink,
  generatePath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { useAppSelector } from "@/app/hooks";
import { EKeyTranslations, IHeaderMenu } from "@/interfaces/common";
import { EActiveTabGenealogy } from "../../user/Genealogy";
import { EConfigKeys } from "@/app/constants/config";
import classNames from "classnames";
import { KEY } from "@/app/constants/request";
import { userServices } from "@/service/userService";
import { EUserRole } from "@/interfaces/user";

import { CaretRightOutlined, SearchOutlined } from "@ant-design/icons";
import { TMultiLangItem, menuItemLanguage } from "@/app/constants/misc";
import LanguageSwitcher from "@/components/platform/app/Header/LanguageSwitcher";
import ExpandableContainer from "@/components/common/ExpandableContainer";

import { takeDecimalNumber, truncateText } from "@/app/common/helper";
import HPCopyText from "@/components/common/HPCopyText";
import type { FetchBalanceResult } from "wagmi/actions";

import logoMetamask from "@/assets/icons/Metamask-Logo.png";
import iconDisconnect from "@/assets/icons/iconDisconnect.svg";

import style from "./style.module.scss";

interface IProps {
  isActiveMenuMB: boolean;
  activeLanguage: TMultiLangItem;
  walletAddress?: string;
  walletBalance?: FetchBalanceResult;
  onSwitchLanguage: (event: { key: EKeyTranslations }) => void;
  onCloseMobileNav: () => void;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export default function MenuHeader({
  activeLanguage,
  isActiveMenuMB,
  walletBalance,
  walletAddress,
  onSwitchLanguage,
  onCloseMobileNav,
  onConnectWallet,
  onDisconnectWallet,
}: IProps) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const { listCategory } = useAppSelector((state) => state.app);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const visitorKey = localStorage.getItem(KEY.VISITOR_KEY);

  const [listAppMenu, setListAppMenu] = useState<IHeaderMenu[]>([]);
  const [searchText, setSearchText] = useState("");

  const onClickMenuChildren: MenuProps["onClick"] = ({ key }) => {
    const keys = key.split(",");
    const categoryParentId_in = keys[0] ?? "";
    const categoryId_in = keys[1] ?? "";
    Number(key) < 0
      ? undefined
      : navigate(
          generatePath(
            `${ERoutePath.PRODUCTS}?${EConfigKeys.categoryParentId}=${categoryParentId_in}&${EConfigKeys.categoryChildrenId}=${categoryId_in}`
          )
        );
  };

  const onClickParentMenu = (categoryParentId_in: number) => {
    navigate(
      generatePath(
        `${ERoutePath.PRODUCTS}?${EConfigKeys.categoryParentId}=${categoryParentId_in}`
      )
    );
  };

  const menuHeader = useMemo(
    () =>
      listCategory.map((category, index) => {
        const menuChildren: any = category.children.map((el, index) => ({
          key: [el.parentId, el.id],
          label: _.capitalize(
            transformLanguageData(i18n.language as EKeyTranslations, el.name)
          ),
        }));
        menuChildren.unshift({
          key: -1,
          label: <img src={category.imgUrl} />,
        });
        return {
          label: (
            <>
              <span onClick={() => onClickParentMenu(category.id)}>
                {_.capitalize(
                  transformLanguageData(
                    i18n.language as EKeyTranslations,
                    category.name
                  )
                )}
              </span>
              <Menu items={menuChildren} onClick={onClickMenuChildren} />
            </>
          ),
          key: category.parentId,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listCategory, i18n.language]
  );

  const menuOrganization = [
    {
      label: t("genealogy.textTreeView"),
      key: EActiveTabGenealogy.Tree,
    },
    {
      label: t("genealogy.textGraphicalView"),
      key: EActiveTabGenealogy.Graphical,
    },
  ];

  const onMenuOrganization: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  const onSearchText = () => {
    console.log("Search: ", searchText);
  };

  const headerMenuClickHandler = () => {
    onCloseMobileNav();
  };

  useEffect(() => {
    if (user) {
      setListAppMenu([
        {
          title: <>{t("header.dropdownUserInfo.labelDashboard")}</>,
          link: ERoutePath.DASH_BOARD_USER,
        },
        ...listAppMenuUser(t, user),
      ]);
    } else {
      setListAppMenu(listMenuDefault(t, user));
    }
  }, [t, user]);

  useEffect(() => {
    if (!visitorKey) {
      const getVisitorKey = async () => {
        const [res, error] = await userServices.getUserVisitorKey();
        if (res.data && res.data?.key) {
          localStorage.setItem(KEY.VISITOR_KEY, res.data?.key);
        }
      };
      getVisitorKey();
    }
  }, [visitorKey, user]);

  useEffect(() => {
    if (visitorKey && user?.role !== EUserRole.admin) {
      const setVisitorKey = async () => {
        const [res, error] = await userServices.setUserVisitorKey(
          visitorKey as string
        );
      };
      setVisitorKey();
    }
  }, [visitorKey, user]);

  return (
    <div className={style.menu}>
      <ul className={style.list}>
        {listAppMenu.map((item, index) => (
          <div key={index}>
            {item.subMenu ? (
              <Dropdown
                align={{
                  offset:
                    item.link === ERoutePath.PRODUCTS ? [-677, 1] : [0, 0],
                }}
                menu={{
                  items:
                    typeof item.subMenu === "boolean"
                      ? menuHeader
                      : item.subMenu,
                  // item.link === ERoutePath.PRODUCTS
                  className:
                    item.link === ERoutePath.PRODUCTS ? "menu-header" : "",
                  onClick:
                    item.link === ERoutePath.PRODUCTS
                      ? undefined
                      : onMenuOrganization,
                }}
              >
                <div>
                  <li
                    className={classNames(
                      location.pathname.includes(item.link) && style.menuActive,
                      style.listItem
                    )}
                  >
                    {item.link === ERoutePath.PRODUCTS ? (
                      <NavLink to={ERoutePath.PRODUCTS}>{item.title}</NavLink>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </li>
                </div>
              </Dropdown>
            ) : (
              <div>
                <li
                  className={classNames(
                    location.pathname.includes(item.link) && style.menuActive,
                    style.listItem
                  )}
                >
                  <NavLink to={item.link}>{item.title}</NavLink>
                </li>
              </div>
            )}
          </div>
        ))}
      </ul>
      {isActiveMenuMB && (
        <div
          className={classNames(
            style["menu__mobile"],
            style["animate-height"],
            {
              [style.active]: isActiveMenuMB,
            }
          )}
        >
          <div className={style["menu__mobile__search-container"]}>
            <Input
              placeholder={`${t("myOrder.btn.search")}...`}
              suffix={<SearchOutlined onClick={onSearchText} />}
              className={style["menu__mobile__search"]}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <Collapse
            bordered={false}
            accordion
            expandIcon={(panelProps) => {
              if (panelProps.collapsible === "disabled") {
                return null;
              }

              return (
                <CaretRightOutlined rotate={panelProps.isActive ? 90 : 0} />
              );
            }}
            ghost
            items={listAppMenu.map((menuItem) => ({
              key: menuItem.link,
              label: (
                <NavLink
                  to={menuItem.link}
                  className={({ isActive }) =>
                    classNames(style["menu__mobile__title"], {
                      [style.active]: isActive,
                    })
                  }
                  onClick={headerMenuClickHandler}
                >
                  {menuItem.title}
                </NavLink>
              ),
              collapsible: menuItem.subMenu ? undefined : "disabled",
              children: !Array.isArray(menuItem.subMenu) ? undefined : (
                <ul className={style["menu__mobile__sub-menu"]}>
                  {menuItem.subMenu.map((item) => {
                    return (
                      <li key={item.key}>
                        <NavLink
                          to={item.key}
                          className={({ isActive }) =>
                            classNames(style["menu__mobile__link-item"], {
                              [style.active]: isActive,
                            })
                          }
                          end
                          onClick={headerMenuClickHandler}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              ),
            }))}
          />
          <Divider />
          {walletAddress ? (
            <ExpandableContainer
              hasArrow={false}
              headerClassname={style["wallet-info__title"]}
              header={
                <div className={style.walletAddress}>
                  <div className={style.balance}>
                    {takeDecimalNumber(Number(walletBalance?.formatted ?? 0))}{" "}
                    {walletBalance?.symbol}
                  </div>
                  <div className={style.address}>
                    {truncateText(walletAddress)}
                  </div>
                </div>
              }
              maxHeight="40px"
            >
              <div className={style["wallet-info__actions"]}>
                <div className={style["wallet-info__actions__address"]}>
                  <img src={logoMetamask} height={24} />
                  <HPCopyText icon={<></>} content={walletAddress}>
                    <span>{truncateText(walletAddress)}</span>
                  </HPCopyText>
                </div>
                <div
                  className={style["wallet-info__actions__disconnect"]}
                  onClick={onDisconnectWallet}
                >
                  <img src={iconDisconnect} />
                  {t("header.Disconnect")}
                </div>
              </div>
            </ExpandableContainer>
          ) : (
            <Button
              onClick={onConnectWallet}
              className={`ant-btn-custom ${style["wallet-btn"]}`}
              type="primary"
            >
              {t("header.Connect wallet")}
            </Button>
          )}

          <LanguageSwitcher
            activeLanguage={activeLanguage}
            languageList={menuItemLanguage}
            onSwitchLanguage={onSwitchLanguage}
          />
        </div>
      )}
    </div>
  );
}

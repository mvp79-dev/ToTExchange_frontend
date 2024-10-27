import { checkErrorContract } from "@/app/common/checkErrorContract";
import { takeDecimalNumber, truncateText } from "@/app/common/helper";
import { KEY } from "@/app/constants/request";
import logoMetamask from "@/assets/icons/Metamask-Logo.png";
import iconDisconnect from "@/assets/icons/iconDisconnect.svg";
import HPBadge from "@/components/common/HPBadge";
import { cartAction } from "@/features/cart/cartSlice";
import {
  CaretDownOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ERoutePath } from "@/app/constants/path";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import cart from "@/assets/icons/cart.svg";
import logoutIcon from "@/assets/icons/header-user-logout.svg";
import orderIcon from "@/assets/icons/header-user-order.svg";
import headerProfileIcon from "@/assets/icons/header-user-profile.svg";
import AppLogo from "@/assets/icons/logo-main.svg";
import dropdownIcon from "@/assets/icons/menu-arrow-dropdown-1.svg";
import profileIcon from "@/assets/icons/profile.svg";
import { userActions } from "@/features/user/userSlice";
import { EKeyTranslations } from "@/interfaces/common";
import DrawerCart from "../../user/DrawerCart";
import MenuHeader from "./MenuHeader";
import style from "./style.module.scss";
import HPCopyText from "@/components/common/HPCopyText";
import classNames from "classnames";
import { menuItemLanguage } from "@/app/constants/misc";
import ProfileMenu from "./ProfileMenu";
import type { MenuItemType } from "antd/es/menu/hooks/useItems";

export default function HPAppHeader() {
  const navigate = useNavigate();
  const { user, balanceNetwork } = useAppSelector((state) => state.user);
  const { carts, totalPrice } = useAppSelector((state) => state.cart);
  const [openCart, setOpenCart] = useState(false);
  const handleOpenCart = () => setOpenCart(true);
  const handleCloseCart = () => setOpenCart(false);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [keyLanguage, setKeyLanguage] = useState<EKeyTranslations>(
    EKeyTranslations.en
  );
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  const quantityInCart = carts.length;

  const itemLanguage =
    menuItemLanguage[
      menuItemLanguage.findIndex((item) => item.key === keyLanguage)
    ] || menuItemLanguage[0];

  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const items: (MenuItemType & { action?: () => void })[] = [
    {
      label: t("header.dropdownUserInfo.labelProfile"),
      key: ERoutePath.PROFILE,
      icon: <img src={headerProfileIcon} alt="" />,
    },
    {
      label: t("header.dropdownUserInfo.labelOrder"),
      key: ERoutePath.MY_ORDER,
      icon: <img src={orderIcon} alt="" />,
    },
    {
      label: t("header.dropdownUserInfo.labelLogout"),
      key: "logout",
      icon: <img src={logoutIcon} alt="" />,
      action: handleLogout,
    },
  ];

  const notLoginProfileMenuItems: MenuItemType[] = [
    {
      label: t("header.textLogin"),
      key: ERoutePath.LOGIN,
      icon: <LoginOutlined />,
    },
    {
      label: t("header.textRegister"),
      key: ERoutePath.REGISTER,
      icon: <LogoutOutlined />,
    },
  ];

  const { connectAsync, connectors } = useConnect({
    onSuccess() {
      // signMessage({ message: `happy365#${timeStamp}` });
    },
  });

  function handleLogout() {
    localStorage.removeItem(KEY.ACCESS_TOKEN);
    localStorage.removeItem(KEY.REFRESH_TOKEN);
    localStorage.removeItem(KEY.VISITOR_KEY);
    dispatch(cartAction.clearCart());
    dispatch(userActions.logoutAccountSuccess());
    navigate(ERoutePath.HOME);
  }

  const onClick: MenuProps["onClick"] = ({ key }) => {
    key === "logout" ? handleLogout() : navigate(key);
  };

  const onChangeKeyI18n = useCallback(
    (key: EKeyTranslations) => {
      i18n.changeLanguage(key);
      localStorage.setItem(KEY.I18N_LANGUAGE, key);
      setKeyLanguage(key);
    },
    [i18n]
  );

  const onClickLanguage: MenuProps["onClick"] = ({ key }) => {
    onChangeKeyI18n(key as EKeyTranslations);
  };

  const onClickWallet: MenuProps["onClick"] = ({ key }) => {
    key === "disconnect" && disconnect();
  };

  const connectWallet = async () => {
    if (typeof window?.ethereum === "undefined") {
      window.open("https://metamask.io/download/");
    } else {
      try {
        await connectAsync({
          connector: connectors[0],
        });
      } catch (error: any) {
        if (error?.message === "Connector not found") {
          window.open("https://metamask.io/download/");
        } else {
          if (error.cause.code === 4001) {
            toast.error(t("toastErrorCommon.Message-1.5"));
          } else {
            checkErrorContract(t, error);
          }
        }
        return;
      }
    }
  };

  const toggleMobileNavHandler = () => {
    setIsOpenMobileMenu((isShow) => !isShow);
  };

  const closeMobileNavHandler = () => {
    setIsOpenMobileMenu(false);
  };

  useEffect(() => {
    const key = localStorage.getItem(KEY.I18N_LANGUAGE) as EKeyTranslations;

    if (key in EKeyTranslations) {
      onChangeKeyI18n(key);
    } else {
      onChangeKeyI18n(EKeyTranslations.en);
    }
  }, [onChangeKeyI18n]);

  return (
    <div className={style.appHeader}>
      <div className={style.onTop}>
        <div className={style.onTop__box}>
          <div>
            {user && (
              <>
                {t("header.welcome")} {user.name}
              </>
            )}
          </div>
          <div className={style.contact}>
            <div className={style.contactWrapper}>
              <Dropdown
                menu={{
                  items: menuItemLanguage,
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
            {!user ? (
              <div className={style.authentication}>
                <img src={profileIcon} alt="" />
                <div className={style.authentication__wrap}>
                  <span className={style.authentication__text}>
                    <NavLink to={ERoutePath.LOGIN}>
                      {t("header.textLogin")}
                    </NavLink>
                  </span>
                  <span className={style.authentication__divider}></span>
                  <span className={style.authentication__text}>
                    <NavLink to={ERoutePath.REGISTER}>
                      {t("header.textRegister")}
                    </NavLink>
                  </span>
                </div>
              </div>
            ) : (
              <div className={style.userInfo}>
                <Dropdown
                  menu={{ items, onClick, className: "dropdownUserInfo" }}
                  align={{
                    offset: [0, 4],
                  }}
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <div className={style.user}>
                        <img src={user.imageProfile ?? profileIcon} alt="" />
                        <span className={style.user__name}>{user?.name}</span>
                        <img src={dropdownIcon} alt="" />
                      </div>
                    </Space>
                  </a>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={style.onBot}>
        <div className={style.top}>
          <div className={style.logo} onClick={() => navigate(ERoutePath.HOME)}>
            {/* <img src={logoIcon} className={style.logo__icon} />
            <img src={logo} alt="logo" width={332} /> */}
            <img src={AppLogo} alt="logo" width={166} />
          </div>
          <div className={style.headerLeft}>
            <div className={style.userInfo__cart} onClick={handleOpenCart}>
              <div className={style.userInfo__cartIcon}>
                <HPBadge count={quantityInCart}>
                  <img src={cart} />
                </HPBadge>
              </div>
              <p className={style.total}>${totalPrice}</p>
            </div>
            {openCart && (
              <DrawerCart open={openCart} onClose={handleCloseCart} />
            )}

            {address ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <div>
                          <img src={logoMetamask} />
                          <span>{truncateText(address)}</span>
                          <div className="boxDisconnect">
                            <img src={iconDisconnect} />
                            {t("header.Disconnect")}
                          </div>
                        </div>
                      ),
                      key: "disconnect",
                      onClick: onClickWallet,
                    },
                  ],
                  className: "disconnectWallet",
                }}
              >
                <div className={style.walletAddress}>
                  <div className={style.balance}>
                    {takeDecimalNumber(Number(balanceNetwork?.formatted ?? 0))}{" "}
                    {balanceNetwork?.symbol}
                  </div>
                  <div className={style.address}>
                    <HPCopyText icon={<></>} content={address}>
                      {truncateText(address)}
                    </HPCopyText>
                  </div>
                </div>
              </Dropdown>
            ) : (
              <Button
                onClick={connectWallet}
                className={`ant-btn-custom ${style["wallet-btn"]}`}
              >
                {t("header.Connect wallet")}
              </Button>
            )}
            <div className={style["mobile-actions"]}>
              <ProfileMenu
                items={user ? items : notLoginProfileMenuItems}
                render={({ onClick }) => (
                  <Button onClick={onClick} className={style["profile-button"]}>
                    <img src={profileIcon} alt="" width={32} height={32} />
                  </Button>
                )}
              ></ProfileMenu>
              <button
                className={style["mobile-toggle-btn"]}
                onClick={toggleMobileNavHandler}
              >
                <div
                  className={classNames(style["mobile-toggle-btn--mobile"], {
                    [style.active]: isOpenMobileMenu,
                  })}
                ></div>
              </button>
            </div>
          </div>
        </div>
        <MenuHeader
          isActiveMenuMB={isOpenMobileMenu}
          activeLanguage={itemLanguage}
          walletAddress={address}
          walletBalance={balanceNetwork}
          onSwitchLanguage={({ key }) => onChangeKeyI18n(key)}
          onCloseMobileNav={closeMobileNavHandler}
          onConnectWallet={connectWallet}
          onDisconnectWallet={disconnect}
        />
      </div>
    </div>
  );
}

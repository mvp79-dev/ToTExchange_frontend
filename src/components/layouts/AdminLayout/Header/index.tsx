import { checkErrorContract } from "@/app/common/checkErrorContract";
import { takeDecimalNumber, truncateText } from "@/app/common/helper";
import { ERoutePath } from "@/app/constants/path";
import { KEY } from "@/app/constants/request";
import { useAppSelector } from "@/app/hooks";
import store from "@/app/store";
import logoMetamask from "@/assets/icons/Metamask-Logo.png";
import logoutIcon from "@/assets/icons/header-user-logout.svg";
import iconDisconnect from "@/assets/icons/iconDisconnect.svg";
import profileIcon from "@/assets/icons/profile.svg";
import { cartAction } from "@/features/cart/cartSlice";
import { userActions } from "@/features/user/userSlice";
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, MenuProps, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { itemsMenuSlideAdmin } from "../SlideMenu";
import style from "./style.module.scss";
type Props = {};

export default function HeaderAdmin() {
  const { user, balanceNetwork } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const location = useLocation();
  const items: MenuProps["items"] = [
    {
      label: "Logout",
      key: "logout",
      icon: <img src={logoutIcon} alt="" />,
    },
  ];

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { t, i18n } = useTranslation();

  const titlePage: any = itemsMenuSlideAdmin(t).find((el) =>
    location.pathname.includes(String(el?.key))
  );
  const { connectAsync, connectors } = useConnect({
    onSuccess() {
      // signMessage({ message: `happy365#${timeStamp}` });
    },
  });

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

  const onClickWallet: MenuProps["onClick"] = ({ key }) => {
    key === "disconnect" && disconnect();
  };

  const handleLogout = () => {
    localStorage.removeItem(KEY.ACCESS_TOKEN);
    localStorage.removeItem(KEY.VISITOR_KEY);
    localStorage.removeItem(KEY.REFRESH_TOKEN);
    store.dispatch(cartAction.clearCart());
    store.dispatch(userActions.logoutAccountSuccess());
    navigate(ERoutePath.HOME);
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    key === "logout" ? handleLogout() : navigate(key);
  };

  return (
    <div className={style.headerAdmin}>
      <h1>{titlePage?.title ?? "Admin Page"}</h1>
      {/* <Input placeholder="Search here..." prefix={<SearchOutlined />} /> */}
      <div className={style.action}>
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
                        Disconnect
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
                {takeDecimalNumber(Number(balanceNetwork?.formatted || 0))}{" "}
                {balanceNetwork?.symbol}
              </div>
              <div className={style.address}>{truncateText(address)}</div>
            </div>
          </Dropdown>
        ) : (
          <Button onClick={connectWallet} className="ant-btn-custom">
            Connect wallet
          </Button>
        )}
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
                  <img src={profileIcon} alt="" />
                  <div>
                    <span className={style.user__name}>{user?.name}</span>
                    <div className={style.user__role}>Admin</div>
                  </div>
                  <CaretDownOutlined />
                </div>
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

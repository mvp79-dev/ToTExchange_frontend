import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import classNames from "classnames";

import { KEY } from "@/app/constants/request";

import AuthImage from "@/assets/images/AuthImage.jpg";
import { ERoutePath } from "@/app/constants/path";
import LogoPlatform from "@/assets/icons/logo.png";
import LogoMini from "@/assets/icons/Logox3.svg";

import style from "./style.module.scss";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

// Layout login/register
export default function AuthLayout({ className }: Props) {
  const authLayoutRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (accessToken) {
      navigate(ERoutePath.HOME);
    }
  }, [navigate]);

  // useEffect(() => {
  //   authLayoutRef?.current?.scrollIntoView({ behavior: "smooth" });
  // }, [authLayoutRef]);

  return (
    <div ref={authLayoutRef} className={style.authLayout}>
      <div>
        <img src={AuthImage} alt="" />
      </div>
      <div className={classNames(style.children, className)}>
        <picture
          onClick={() => navigate(ERoutePath.HOME)}
          className={style.logo}
        >
          <source
            srcSet={LogoMini}
            media={`(max-width: ${EResponsiveBreakpoint.xs}px)`}
          />

          <img src={LogoPlatform} alt="logo" />
        </picture>

        <Outlet />
      </div>
    </div>
  );
}

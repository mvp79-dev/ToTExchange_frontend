import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "../../../app/constants/path";
import { KEY } from "../../../app/constants/request";
import { useAppDispatch } from "../../../app/hooks";

type Props = { children?: React.ReactNode };

export default function AuthorizationLayout({ children }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (!accessToken) {
      navigate(ERoutePath.LOGIN);
    }
  }, [dispatch, navigate]);

  return <>{children}</>;
}

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { KEY } from "@/app/constants/request";
import { useAppDispatch } from "@/app/hooks";

export default function AuthenticatedLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (!accessToken) {
      navigate(ERoutePath.LOGIN);
    }
  }, [dispatch, navigate]);

  return <Outlet />;
}

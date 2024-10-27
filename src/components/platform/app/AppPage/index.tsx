import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "../../../../app/constants/path";
import { useAppSelector } from "@/app/hooks";
import { EUserRole } from "@/interfaces/user";
import { KEY } from "@/app/constants/request";

export default function AppPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user?.role) return;
    if (user.role === EUserRole.admin || user.role === EUserRole.employee) {
      navigate(ERoutePath.ADMIN_DASHBOARD);
    } else {
      navigate(ERoutePath.HOME);
    }
  }, [navigate, user?.role]);

  useEffect(() => {
    const token = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (!token) {
      navigate(ERoutePath.HOME);
    }
  }, [navigate, user?.role]);

  return <></>;
}

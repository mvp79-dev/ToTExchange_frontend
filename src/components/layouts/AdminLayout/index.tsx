import { Col, Row } from "antd";
import React, { useEffect, useRef } from "react";
import SlideMenuAdmin from "./SlideMenu";
import HeaderAdmin from "./Header";
import style from "./style.module.scss";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { EUserRole } from "@/interfaces/user";
import { ERoutePath } from "@/app/constants/path";
import { KEY } from "@/app/constants/request";

// layout admin
export default function AdminLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const adminLayoutRef = useRef<any>(null);
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (!token) {
      navigate(ERoutePath.LOGIN);
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?.role) return;
    if (user.role !== EUserRole.admin && user.role !== EUserRole.employee) {
      navigate(ERoutePath.HOME);
    }
  }, [navigate, user?.role]);

  useEffect(() => {
    adminLayoutRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [adminLayoutRef]);

  return (
    <div ref={adminLayoutRef}>
      <Row>
        <Col span={4}>
          <SlideMenuAdmin />
        </Col>
        <Col span={20}>
          <Row>
            <Col span={24}>
              <HeaderAdmin />
            </Col>
            <Col span={24}>
              <div className={style.children}>{children}</div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

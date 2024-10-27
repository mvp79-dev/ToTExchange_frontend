import AdminLayout from "@/components/layouts/AdminLayout";
import RecentlyActivity from "./RecentlyActivity";
import style from "./style.module.scss";
import { Col, Row } from "antd";
import TotalRevenue from "./TotalRevenue";
import TotalVisitor from "./TotalVisitor";
import TotalSale from "./TotalSale";
import { useEffect } from "react";
import { KEY } from "@/app/constants/request";
import { userServices } from "@/service/userService";
import { useAppSelector } from "@/app/hooks";
type Props = {};

export default function DashboardManagementAdmin() {
  const visitorKey = localStorage.getItem(KEY.VISITOR_KEY);
  const { user } = useAppSelector((state) => state.user);
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
    if (visitorKey) {
      const setVisitorKey = async () => {
        const [res, error] = await userServices.setUserVisitorKey(
          visitorKey as string
        );
      };
      setVisitorKey();
    }
  }, [visitorKey, user]);

  return (
    <AdminLayout>
      <div className={style.dashboardManagement}>
        <RecentlyActivity />
        <Row gutter={[30, 0]}>
          <Col span={14}>
            <TotalRevenue />
          </Col>
          <Col span={10}>
            <TotalVisitor />
          </Col>
        </Row>
        <TotalSale />
      </div>
    </AdminLayout>
  );
}

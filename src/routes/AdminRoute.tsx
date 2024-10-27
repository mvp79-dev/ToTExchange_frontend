import { ERoutePath } from "@/app/constants/path";
import AuthorizationLayout from "@/components/layouts/AuthorizationLayout";
import BalanceTrackingManagement from "@/components/platform/admin/BalanceTracking";
import DashboardManagementAdmin from "@/components/platform/admin/Dashboard";
import OrderAdminDetailManagement from "@/components/platform/admin/OrderDetail";
import OrdersManagementAdmin from "@/components/platform/admin/Orders";
import ProductManagementAdmin from "@/components/platform/admin/Products";
import CreateProductPage from "@/components/platform/admin/Products/CreateProduct";
import EditProductPage from "@/components/platform/admin/Products/EditProduct";
import SalesReportManagementAdmin from "@/components/platform/admin/SalesReport";
import SettingsManagementAdmin from "@/components/platform/admin/Settings";
import AppPage from "@/components/platform/app/AppPage";
import { Route, Routes } from "react-router-dom";

export function AdminRoute() {
  return (
    <Routes>
      <Route
        path={ERoutePath.ADMIN_DASHBOARD}
        element={
          <AuthorizationLayout>
            <DashboardManagementAdmin />
          </AuthorizationLayout>
        }
      />
      <Route
        path={ERoutePath.ADMIN_BALANCE_TRACKING}
        element={
          <AuthorizationLayout>
            <BalanceTrackingManagement />
          </AuthorizationLayout>
        }
      />
      <Route
        path={ERoutePath.ADMIN_ORDERS}
        element={
          <AuthorizationLayout>
            <OrdersManagementAdmin />
          </AuthorizationLayout>
        }
      />
      <Route path={ERoutePath.ADMIN_PRODUCTS}>
        <Route
          index
          element={
            <AuthorizationLayout>
              <ProductManagementAdmin />
            </AuthorizationLayout>
          }
        />
        <Route
          path={ERoutePath.ADMIN_PRODUCTS_CREATE}
          element={
            <AuthorizationLayout>
              <CreateProductPage />
            </AuthorizationLayout>
          }
        />
        <Route
          path={ERoutePath.ADMIN_PRODUCTS_EDIT}
          element={
            <AuthorizationLayout>
              <EditProductPage />
            </AuthorizationLayout>
          }
        />
      </Route>
      <Route
        path={ERoutePath.ADMIN_ORDERS_DETAIL}
        element={
          <AuthorizationLayout>
            <OrderAdminDetailManagement />
          </AuthorizationLayout>
        }
      />
      <Route
        path={ERoutePath.ADMIN_SALES_REPORT}
        element={
          <AuthorizationLayout>
            <SalesReportManagementAdmin />
          </AuthorizationLayout>
        }
      />
      <Route
        path={ERoutePath.ADMIN_SETTINGS}
        element={
          <AuthorizationLayout>
            <SettingsManagementAdmin />
          </AuthorizationLayout>
        }
      />
      <Route path="*" element={<AppPage />} />
    </Routes>
  );
}

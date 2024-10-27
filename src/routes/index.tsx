import { ERoutePath } from "@/app/constants/path";
import AuthLayout from "@/components/layouts/AuthLayout";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import AuthorizationLayout from "@/components/layouts/AuthorizationLayout";
import UserDefaultLayout from "@/components/layouts/UserDefaultLayout";
import AboutUsPage from "@/components/platform/app/AboutUs/AboutHappy365";
import FounderMessagePage from "@/components/platform/app/AboutUs/FounderMessage";
import AboutVisionPage from "@/components/platform/app/AboutUs/Vision";
import AppPage from "@/components/platform/app/AppPage";
import Home from "@/components/platform/app/Home";
import { NewsHeathPage } from "@/components/platform/app/News/Heath";
import { NewsSciencePage } from "@/components/platform/app/News/Science";
import NewsScienceDetail from "@/components/platform/app/News/ScienceDetail";
import ForgotPasswordPage from "@/components/platform/auth/ForgotPassword";
import LoginPage from "@/components/platform/auth/Login";
import RegisterPage from "@/components/platform/auth/Register";
import Marketplace from "@/components/platform/marketplace";
import ProductDetailPage from "@/components/platform/product/ProductDetail";
import ProductListPage from "@/components/platform/product/ProductList";
import Alerts from "@/components/platform/user/Alerts";
import CartCheckoutPage from "@/components/platform/user/CartCheckout";
import CommissionPage from "@/components/platform/user/CommissionPage";
import DashboardUserPage from "@/components/platform/user/DashboardUserPage/Home";
import GenealogyPage from "@/components/platform/user/Genealogy";
import MyCartPage from "@/components/platform/user/MyCart";
import MyOrder from "@/components/platform/user/MyOrder";
import ProfilePage from "@/components/platform/user/Profile";
import { Route, Routes } from "react-router-dom";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ERoutePath.LOGIN} element={<LoginPage />} />
        <Route path={ERoutePath.REGISTER} element={<RegisterPage />} />
        <Route
          path={ERoutePath.FORGOT_PASSWORD}
          element={<ForgotPasswordPage />}
        />
      </Route>

      <Route path={ERoutePath.HOME} element={<Home />} />
      <Route path={ERoutePath.PRODUCTS} element={<ProductListPage />} />
      <Route path={ERoutePath.PRODUCT_DETAIL} element={<ProductDetailPage />} />

      <Route element={<UserDefaultLayout />}>
        <Route path={ERoutePath.ABOUT_US} element={<AboutUsPage />} />
        <Route
          path={ERoutePath.ABOUT_US_VISION}
          element={<AboutVisionPage />}
        />
        <Route
          path={ERoutePath.ABOUT_US_MESSAGE}
          element={<FounderMessagePage />}
        />

        {/* Route Auth */}
        <Route element={<AuthenticatedLayout />}>
          <Route path={ERoutePath.MARKETPLACE} element={<Marketplace />} />
          <Route path={ERoutePath.MY_CART} element={<MyCartPage />} />
          <Route
            path={ERoutePath.DASH_BOARD_USER}
            element={<DashboardUserPage />}
          />
          <Route path={ERoutePath.PROFILE} element={<ProfilePage />} />
          <Route path={ERoutePath.NEWS_HEALTH} element={<NewsHeathPage />} />
          <Route path={ERoutePath.NEWS_SCIENCE} element={<NewsSciencePage />} />
          <Route
            path={ERoutePath.NEWS_SCIENCE_DETAIL}
            element={<NewsScienceDetail />}
          />
          <Route path={ERoutePath.MY_GENEALOGY} element={<GenealogyPage />} />
          <Route path={ERoutePath.MY_ALERTS} element={<Alerts />} />
        </Route>
      </Route>

      <Route
        path={ERoutePath.CART_CHECKOUT}
        element={
          <AuthorizationLayout>
            <CartCheckoutPage />
          </AuthorizationLayout>
        }
      />
      <Route
        path={ERoutePath.MY_ORDER}
        element={
          <AuthorizationLayout>
            <MyOrder />
          </AuthorizationLayout>
        }
      />
      <Route
        path={ERoutePath.MY_ORDER}
        element={
          <AuthorizationLayout>
            <MyOrder />
          </AuthorizationLayout>
        }
      />

      <Route
        path={ERoutePath.MY_COMMISSION}
        element={
          <AuthorizationLayout>
            <CommissionPage />
          </AuthorizationLayout>
        }
      />

      <Route path={ERoutePath.CONTACT_US} element={<Home />} />

      <Route path="*" element={<AppPage />} />
    </Routes>
  );
}

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";

import AdminLayout from "./admin.layout";
import SignInPage from "../../pages/signin.page";
import { PageNotFound } from "../../pages/not_found.page";
import { Spinner } from "../ui/loader/_spinner";

// Admin Pages
import AdminProductDash from "../AdminDash/pages/Dashboard/productDash";
import AdminTallowDash from "../AdminDash/pages/Dashboard/tallowDash";
import OverviewDash from "../AdminDash/pages/Dashboard/OverviewDash";
import OrdersDash from "../AdminDash/pages/Dashboard/OrdersDash";
import OrderDetailsDash from "../AdminDash/pages/Dashboard/OrderDetailsDash";

import { RequireAdmin } from "./requireAdmin";
import { useAppDispatch } from "@/core/constants";
import { fetchUserProfile } from "@/core/store/slice/user_slice";

export const AppRoute = () => {
  const dispatch = useAppDispatch();

  const { isLoading: appLoading } = useSelector((state: RootState) => state.appSlice);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (appLoading) {
    return (
      <div className="text-center flex relative flex-col h-screen justify-center items-center bg-[#2a2a2a]">
        <Spinner className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#2a2a2a]/80" size={"xl"} />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Admin Sign-In Routes */}
      <Route path="/admin/signin" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/admin/auth" element={<Navigate to="/admin/signin" replace />} />
      <Route path="/auth" element={<Navigate to="/admin/signin" replace />} />

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Admin Dashboard Protected Routes */}
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default Route */}
          <Route index element={<OverviewDash />} />
          <Route path="overview" element={<OverviewDash />} />

          {/* Orders Management */}
          <Route path="orders" element={<OrdersDash />} />
          <Route path="orders/:id" element={<OrderDetailsDash />} />

          {/* Product Management */}
          <Route path="products" element={<AdminProductDash />} />
          <Route path="products/new" element={<AdminProductDash />} />
          <Route path="products/tallow" element={<AdminTallowDash />} />

          {/* Catch-All 404 under layout */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>

      {/* Root level Fallback 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

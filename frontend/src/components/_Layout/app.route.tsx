// AppRoute.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import { VerifiedLayout } from "./pages.layout";
import { AdminLayout } from "./admin.layout";
import { PageNotFound } from "../pages/not_found.page";
import LandingPage from "../pages/landing";
import StorePage from "../pages/product/products";
// import GalleryPage from "../pages/Gallery/gallery";
import SignInPage from "../pages/signin.page";
import CartPage from "../pages/Cart/cart.page";
import AdminProductDash from "../AdminDash/pages/Dashboard/productDash";
import { Spinner } from "../ui/loader/_spinner";
import { cn } from "@/lib/utils";

export const AppRoute = () => {
  const { user, isLoading: userLoading } = useSelector((state: RootState) => state.userSlice);
  const { isLoading: appLoading } = useSelector((state: RootState) => state.appSlice);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  if (userLoading || appLoading) {
    return (
      <div
        className={cn(
          "fixed top-0 left-0 w-full h-full flex items-center bg-primary justify-center z-50",
          appLoading && "bg-primary/50"
        )}
      >
        <div className="text-center flex relative flex-col">
          <Spinner size={"xl"} />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<VerifiedLayout auth={isAuthenticated} />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<StorePage />} />
        {/* <Route path="/gallery" element={<GalleryPage />} /> */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          isAdmin ? (
            <AdminLayout auth={isAuthenticated} />
          ) : (
            <Navigate to="/admin/signin" replace />
          )
        }
      >
        <Route path="productDash" element={<AdminProductDash />} />
        <Route path="profile" element={<LandingPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      {/* Admin Sign-In */}
      <Route path="/admin/signin" element={<SignInPage />} />
    </Routes>
  );
};

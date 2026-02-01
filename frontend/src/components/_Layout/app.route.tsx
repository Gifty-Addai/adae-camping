import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";

import { VerifiedLayout } from "./pages.layout";
import AdminLayout from "./admin.layout";
import StorePage from "../pages/product/products";
import SignInPage from "../pages/signin.page";
import CartPage from "../pages/Cart/cart.page";
import { PageNotFound } from "../pages/not_found.page";
import { Spinner } from "../ui/loader/_spinner";

// Admin Pages
import AdminProductDash from "../AdminDash/pages/Dashboard/productDash";
import AdminTallowDash from "../AdminDash/pages/Dashboard/tallowDash";

// Other pages
import LandingPage from "../pages/Landing/landing.page";
import ProductDetailPage from "../pages/product/product-detail";
import BecomeMemberPage from "../pages/fie-member-form";
import AboutPage from "../pages/about.page";
import ContactPage from "../pages/contact.page";
import { RequireAdmin } from "./requireAdmin";
import { useAppDispatch } from "@/core/constants";
import { fetchUserProfile } from "@/core/store/slice/user_slice";


export const AppRoute = () => {

  const dispatch = useAppDispatch();

  const { user } = useSelector((state: RootState) => state.userSlice);
  const { isLoading: appLoading } = useSelector((state: RootState) => state.appSlice);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (appLoading) {
    return (
      <div className="text-center flex relative flex-col">
        <Spinner className="fixed top-0 left-0 w-full h-full flex items-center bg-primary justify-center z-50" size={"xl"} />
      </div>
    );
  }

  return (
    <Routes>
      {/* ---------------------------------------
          Public / Unauthenticated Routes
      --------------------------------------- */}
      <Route element={<VerifiedLayout auth={!!user} />}>
        {/* Set LandingPage as the Home Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dedicated Shop Page */}
        <Route path="/products" element={<StorePage />} />

        {/* Membership Form */}
        <Route path="/member" element={<BecomeMemberPage />} />

        {/* Product Detail */}
        <Route path="/product/:produtName/:productId" element={<ProductDetailPage />} />

        {/* Cart */}
        <Route path="/cart" element={<CartPage />} />

        {/* About Us */}
        <Route path="/about" element={<AboutPage />} />

        {/* Contact Us */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Catch-All 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Route>

      {/* ---------------------------------------
          Admin Sign-In Route (Public)
      --------------------------------------- */}
      <Route path="/admin/signin" element={<SignInPage />} />

      {/* ---------------------------------------
          Admin Routes (Protected by RequireAdmin)
      --------------------------------------- */}
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* 
            Admin child routes inside this layout. 
            Because of <RequireAdmin />, only users with role="admin" can see these.
          */}

          {/* Product Management */}
          <Route path="products">
            <Route index element={<AdminProductDash />} />
            <Route path="new" element={<AdminProductDash />} />
            <Route path="tallow" element={<AdminTallowDash />} />
          </Route>

          {/* Fallback 404 for Admin */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

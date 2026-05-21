import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";

import { VerifiedLayout } from "./pages.layout";
import StorePage from "../pages/product/products";
import SignInPage from "../pages/signin.page";

import CheckoutPage from "../pages/checkout/checkout.page";
import { PageNotFound } from "../pages/not_found.page";
import { Spinner } from "../ui/loader/_spinner";

// Other pages
import LandingPage from "../pages/Landing/landing.page";
import ProductDetailPage from "../pages/product/product-detail";
import BecomeMemberPage from "../pages/fie-member-form";
import AboutPage from "../pages/about.page";
import ContactPage from "../pages/contact.page";
import RefundPolicyPage from "../pages/refund-policy.page";
import ShippingPolicyPage from "../pages/shipping-policy.page";
import PrivacyPolicyPage from "../pages/privacy-policy.page";
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

        {/* Checkout */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* About Us */}
        <Route path="/about" element={<AboutPage />} />

        {/* Contact Us */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Refund Policy */}
        <Route path="/refund-policy" element={<RefundPolicyPage />} />

        {/* Shipping Policy */}
        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />

        {/* Privacy Policy */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        {/* Catch-All 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Route>

      {/* ---------------------------------------
          Authentication Routes
      --------------------------------------- */}
      <Route path="/auth" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignInPage />} />
    </Routes>
  );
};


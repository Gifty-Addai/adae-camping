import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";

import { VerifiedLayout } from "./pages.layout";
import AdminLayout from "./admin.layout";
import LandingPage from "../pages/landing";
import StorePage from "../pages/product/products";
import SignInPage from "../pages/signin.page";
import CartPage from "../pages/Cart/cart.page";
import { PageNotFound } from "../pages/not_found.page";
import { Spinner } from "../ui/loader/_spinner";

// Admin Pages
import AdminProductDash from "../AdminDash/pages/Dashboard/productDash";
import AdminTripPage from "../AdminDash/pages/trip/admin-trip.page";
import AdminTripFormPage from "../AdminDash/pages/trip/tripFormPage";
import AddTripPage from "../AdminDash/pages/trip/trip-add";
import AdminBookingPage from "../AdminDash/pages/booking/admin.booking.page";
import BookingDetailPage from "../AdminDash/pages/booking/booking-detail";

// Other pages
import { TripPage } from "../pages/Trips/trip.page";
import TripDetail from "../pages/Trips/trip.details.page";
import BookingPage from "../pages/Bookings/booking.page";
import ProductDetailPage from "../pages/product/product-detail";
import BecomeMemberPage from "../pages/fie-member-form";
import { RequireAdmin } from "./requireAdmin";
import { useAppDispatch } from "@/core/constants";
import { fetchUserProfile } from "@/core/store/slice/user_slice";
import AdminRequestsPage from "../AdminDash/pages/requestDates/admin_requeset_dates";

// Route Guards
// import { RequireAuth } from "./RequireAuth";

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<StorePage />} />

        {/* Trip & Booking Pages */}
        <Route path="/trip" element={<TripPage />} />
        <Route path="/trip/:id" element={<TripDetail />} />
        <Route path="/booking/:id/:date" element={<BookingPage />} />

        {/* Membership Form */}
        <Route path="/member" element={<BecomeMemberPage />} />

        {/* Product Detail */}
        <Route path="/product/:produtName/:productId" element={<ProductDetailPage />} />

        {/* Cart */}
        <Route path="/cart" element={<CartPage />} />

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
            {/* Add more product routes if needed */}
          </Route>

          {/* Bookings Management */}
          <Route path="bookings">
            <Route index element={<AdminBookingPage />} />
            <Route path="bookingsDetail/:bookingId" element={<BookingDetailPage />} />
          </Route>

          {/* Trips Management */}
          <Route path="trips">
            <Route index element={<AdminTripPage />} />
            <Route path="new" element={<AdminTripFormPage />} />
            <Route path="edit/:id" element={<AdminTripFormPage />} />
            <Route path="add" element={<AddTripPage />} />
            <Route path="requests" element={<AdminRequestsPage />} />
          </Route>

          {/* Example placeholders
          <Route path="users">
            <Route index element={<AllUsersPage />} />
            <Route path="new" element={<CreateUserPage />} />
          </Route>

          <Route path="gallery">
            <Route index element={<AllGalleryItemsPage />} />
            <Route path="new" element={<AddGalleryItemPage />} />
          </Route>

          <Route path="videos">
            <Route index element={<AllVideosPage />} />
            <Route path="new" element={<UploadVideoPage />} />
          </Route>

          <Route path="testimonies">
            <Route index element={<AllTestimoniesPage />} />
            <Route path="new" element={<AddTestimonyPage />} />
          </Route>
          */}

          {/* Fallback 404 for Admin */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

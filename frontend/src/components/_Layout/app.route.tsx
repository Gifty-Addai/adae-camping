// AppRoute.tsx

import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import { VerifiedLayout } from "./pages.layout";
import { PageNotFound } from "../pages/not_found.page";
import LandingPage from "../pages/landing";
import StorePage from "../pages/product/products";
// import GalleryPage from "../pages/Gallery/gallery";
import SignInPage from "../pages/signin.page";
import CartPage from "../pages/Cart/cart.page";
import AdminProductDash from "../AdminDash/pages/Dashboard/productDash";
import { Spinner } from "../ui/loader/_spinner";
import { cn } from "@/lib/utils";
import AdminLayout from "./admin.layout";
import AdminTripPage from "../AdminDash/pages/trip/admin-trip.page";
import AdminTripFormPage from "../AdminDash/pages/trip/tripFormPage";
import { TripPage } from "../pages/Trips/trip.page";
import TripDetail from "../pages/Trips/trip.details.page";
import BookingPage from "../pages/Bookings/booking.page";

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
        <Route path="/booking/:id/:date" element={<BookingPage />} />
        <Route path="/trip" element={<TripPage />} />
        <Route path="/trip/:id" element={<TripDetail />} />
        {/* <Route path="/gallery" element={<GalleryPage />} /> */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          isAdmin ? <AdminLayout /> : <Navigate to="/admin/signin" replace />
        }
      >
        {/* Authentication Routes */}
        <Route path="auth" element={<Outlet />}>
          <Route path="signin" element={<SignInPage />} />
          {/* Add more auth routes if needed */}
        </Route>

        {/* Products Routes */}
        <Route path="products" element={<Outlet />}>
          <Route index element={<AdminProductDash />} />
          <Route path="new" element={<AdminProductDash />} />
          {/* Add more product routes if needed */}
        </Route>

        {/* Bookings Routes */}
        <Route path="bookings" element={<Outlet />}>
          {/* <Route index element={<AllBookingsPage />} />
          <Route path="new" element={<NewBookingPage />} /> */}
          {/* Add more booking routes if needed */}
        </Route>

        {/* Users Routes */}
        <Route path="users" element={<Outlet />}>
          {/* <Route index element={<AllUsersPage />} />
          <Route path="new" element={<CreateUserPage />} /> */}
          {/* Add more user routes if needed */}
        </Route>

        {/* Trips Routes */}
        <Route path="trips" element={<Outlet />}>
          <Route index element={<AdminTripPage />} />
          <Route path="new" element={<AdminTripFormPage  />} />
          <Route path="edit/:id" element={<AdminTripFormPage  />} />
          {/* Add more trip routes if needed */}
        </Route>

        {/* Gallery Routes */}
        <Route path="gallery" element={<Outlet />}>
          {/* <Route index element={<AllGalleryItemsPage />} />
          <Route path="new" element={<AddGalleryItemPage />} /> */}
          {/* Add more gallery routes if needed */}
        </Route>

        {/* Videos Routes */}
        <Route path="videos" element={<Outlet />}>
          {/* <Route index element={<AllVideosPage />} />
          <Route path="new" element={<UploadVideoPage />} /> */}
          {/* Add more video routes if needed */}
        </Route>

        {/* Testimonies Routes */}
        <Route path="testimonies" element={<Outlet />}>
          {/* <Route index element={<AllTestimoniesPage />} />
          <Route path="new" element={<AddTestimonyPage />} /> */}
          {/* Add more testimony routes if needed */}
        </Route>

        {/* Additional Admin Routes */}
        {/* <Route path="profile" element={<ProfilePage />} /> */}
        {/* Add other standalone admin routes if needed */}

        {/* Fallback Route */}
        <Route path="*" element={<PageNotFound />} />
      </Route>


      {/* Admin Sign-In */}
      <Route path="/admin/signin" element={<SignInPage />} />
    </Routes>
  );
};

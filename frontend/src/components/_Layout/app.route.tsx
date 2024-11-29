import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { VerifiedLayout } from "./pages.layout";
import { AdminLayout } from "./admin.layout";
import { PageNotFound } from "../pages/not_found.page";
import LandingPage from "../pages/landing";
import StorePage from "../pages/product/products";
import GalleryPage from "../pages/Gallery/gallery";
// import BookingPage from "../pages/bookings";
// import UserBookingsPage from "../pages/Bookings/user_book_page";
// import SettingsPage from "../pages/Settings/settings";
import { Spinner } from "../ui/loader/_spinner";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import { setUser } from "@/core/store/slice/user_slice";
import { isDev } from "@/core/constants";
import { getUserSession } from "@/lib/utils";
import SignInPage from "../pages/signin.page";
import CartPage from "../pages/Cart/cart.page";

export const AppRoute = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appSlice);
  // const userStore = useSelector((state: RootState) => state.userSlice);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let userSession = getUserSession();

    if (isDev) {
      // Mock user for development environment
      userSession = {
        id: "mock-user-id",
        role: "admin",
        name: "Mock User",
      };
    }

    if (userSession) {
      setIsAuthenticated(true);
      setIsAdmin(userSession.role === "admin");
      dispatch(setUser(userSession));
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }

    setIsLoading(false);
  }, [dispatch]);

  if (isLoading || appState.isLoading) {
    return (
      <div
        className={cn(
          "fixed top-0 left-0 w-full h-full flex items-center bg-primary justify-center z-50",
          appState.isLoading && "bg-primary/50"
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
        <Route path="/gallery" element={<GalleryPage />} />
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
        <Route path="main" element={<LandingPage />} />
        <Route path="profile" element={<LandingPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      {/* Admin Sign-In */}
      <Route path="/admin/signin" element={<SignInPage />} />
    </Routes>
  );
};

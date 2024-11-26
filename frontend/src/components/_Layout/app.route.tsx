import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { VerifiedLayout } from "./pages.layout";
import { AdminLayout } from "./admin.layout";
import { PageNotFound } from "../pages/not_found.page";
import LandingPage from "../pages/landing";
import StorePage from "../pages/product/products";
import CartPage from "../pages/product/cart.page";
import GalleryPage from "../pages/Gallery/gallery";
import BookingPage from "../pages/bookings";
import UserBookingsPage from "../pages/Bookings/user_book_page";
import SettingsPage from "../pages/Settings/settings";
import { Spinner } from "../ui/loader/_spinner";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import { setUser } from "@/core/store/slice/user_slice";
import { isDev } from "@/core/constants";
import { getUserSession } from "@/lib/utils";

// Helper function to handle authentication state
const checkAuthentication = () => {
  const user = getUserSession();
  console.info('user', user)
  return user ? true : false;
};

// ProtectedRoute component to restrict access to authenticated routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = checkAuthentication();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// AdminRoute component to restrict access to admin routes based on role
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = getUserSession();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const AppRoute = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appSlice);
  const userStore = useSelector((state: RootState) => state.userSlice);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let userSession = getUserSession();
    console.log('First User Session Found:', userSession);

    if (isDev) {
      // Mock user for development environment
      userSession = {
        id: "mock-user-id",
        role: "user",
        name: "Mock User",
      };
    }

    if (userSession) {
      console.log('Second User Session Found:', userSession);
      setIsAuthenticated(true);
      dispatch(setUser(userSession));
      console.log('Third User Session Found:', getUserSession());
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false); // Stop loading once authentication check is complete
  }, [dispatch]);


  // Render loading state during app initialization
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

  // If no user is authenticated, render public routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route element={<VerifiedLayout auth={isAuthenticated} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    );
  }

  // Render routes based on user role
  return (
    <Routes>
      {/* User Routes */}
      {userStore.user?.role === "user" ? (
        <Route element={<VerifiedLayout auth={isAuthenticated} />}>
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <StorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/page"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/user"
            element={
              <ProtectedRoute>
                <UserBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LandingPage />} />
        </Route>
      ) : null}

      {/* Admin Routes */}
      {userStore.user?.role === "admin" ? (
        <Route element={<AdminLayout auth={isAuthenticated} />}>
          <Route
            path="/admin/"
            element={
              <AdminRoute>
                <LandingPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/main"
            element={
              <AdminRoute>
                <LandingPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <AdminRoute>
                <LandingPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/other"
            element={
              <AdminRoute>
                <LandingPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      ) : null}

      {/* Fallback Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

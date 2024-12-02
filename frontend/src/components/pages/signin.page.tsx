// src/pages/signin.page.tsx

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { localStorageUtil } from "@/lib/utils";
import { useNavigate, Navigate } from "react-router-dom";
import { SignInResponse } from "@/core/interfaces";
import { Page } from "../ui/page";
import { setUser, setLoading, setError } from "@/core/store/slice/user_slice";
import { sigin } from "@/lib/apiUtils";
import { RootState } from "@/core/store/store";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state: RootState) => state.userSlice);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      dispatch(setLoading(true));
      // Authenticate User
      const signInResponse: SignInResponse = await sigin(data);
      console.log("Sign In Response:", signInResponse);

      // Check if the user role is admin
      if (signInResponse.user.role !== "admin") {
        throw new Error("Access denied. Admins only.");
      }

      // Save the user data and token to localStorage and Redux
      localStorageUtil.set("user-info", signInResponse.user);
      localStorageUtil.set("token", signInResponse.token);
      dispatch(setUser(signInResponse.user));

      // Redirect to admin dashboard
      navigate("/admin/productDash");
    } catch (error: any) {
      console.error("Error:", error);
      dispatch(setError(error.message || "There was an error with your request. Please try again."));
    }
  };

  // Redirect authenticated admin users away from sign-in page
  if (user && user.role === "admin") {
    return <Navigate to="/admin/productDash" replace />;
  }

  return (
    <Page
      renderBody={() => (
        <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-center text-xl font-semibold text-card-foreground">Admin Sign In</h2>
          <p className="text-center text-sm text-card-foreground">Sign in to your admin account to continue</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your admin email"
                      className="w-full"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {/* Display Error Message */}
          {error && (
            <div className="mt-4 text-red-500 text-center">
              {error}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default SignInPage;

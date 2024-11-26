import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/context/signIn_modal_context";
import { useDispatch } from "react-redux";
import { setUser } from "@/core/store/slice/user_slice";
import { getUserSession, postRequest, localStorageUtil } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Define Zod Schemas for Validation
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignInModal = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, setSignIn } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<SignInFormValues | SignUpFormValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isSignUp && { confirmPassword: "" }),
    },
  });

  const onSubmit = async (data: SignInFormValues | SignUpFormValues) => {
    try {
      if (isSignUp) {
        // Handle Sign-Up logic (Create User)
        const signUpResponse = await postRequest("/api/auth/signup", data);
        console.log("Sign Up Response:", signUpResponse);

        // After successful sign-up, sign in the user automatically
        const signInData = {
          email: data.email,
          password: data.password,
        };
        const signInResponse = await postRequest("/api/auth/signin", signInData);
        console.log("Sign In Response:", signInResponse);

        // Save the user data and token to localStorage and Redux
        localStorageUtil.set("user-info", signInResponse.user);
        localStorageUtil.set("token", signInResponse.token); // If handling tokens separately
        dispatch(setUser(signInResponse.user));

        // Redirect based on user role
        if (signInResponse.user.role === "admin") {
          navigate("/admin/main"); // Redirect to Admin Dashboard
        } else {
          navigate("/"); // Redirect to Home or User Dashboard
        }

        setSignIn(false);
      } else {
        // Handle Sign-In logic (Authenticate User)
        const signInResponse = await postRequest("/api/auth/signin", data);
        console.log("Sign In Response:", signInResponse);

        // Save the user data and token to localStorage and Redux
        localStorageUtil.set("user-info", signInResponse.user);
        localStorageUtil.set("token", signInResponse.token); // If handling tokens separately
        dispatch(setUser(signInResponse.user));

        // Redirect based on user role
        if (signInResponse.user.role === "admin") {
          navigate("/admin/main"); // Redirect to Admin Dashboard
        } else {
          navigate("/"); // Redirect to Home or User Dashboard
        }

        setSignIn(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error with your request. Please try again.");
    }
  };

  return (
    <Dialog open={signIn} onOpenChange={() => setSignIn(false)}>
      <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {isSignUp ? "Sign up with email" : "Sign in with email"}
          </DialogTitle>
          <p className="text-center text-sm">
            {isSignUp
              ? "Create an account to get started."
              : "Make a new doc to bring your words, data, and teams together. For free."}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-1">
            {/* Email Input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full"
                      {...field}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Input (for Sign Up only) */}
            {isSignUp && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        className="w-full"
                        {...field}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Forgot Password (Sign In only) */}
            {!isSignUp && (
              <div className="flex justify-end">
                <Button variant="link" size="sm">
                  Forgot password?
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {isSignUp ? "Sign Up" : "Get Started"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsSignUp((prev) => !prev)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </div>

        <div className="relative my-4">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-2 bg-white text-sm">Or sign in with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center gap-4">
          <Button size="icon">
            <Icons.google className="h-4 w-4" />
          </Button>
          <Button size="icon">
            <Icons.facebook className="h-4 w-4" />
          </Button>
          <Button size="icon">
            <Icons.apple className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate } from "react-router-dom";
import { Page } from "../ui/page";
import { loginAndSendOTP, verifyOTPAndLogin } from "@/core/store/slice/user_slice";
import { useAppDispatch } from "@/core/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import OtpInput from "@/components/ui/otp-input";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const signInSchema = z.object({
  // email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const dispatch = useAppDispatch();
  const { user, status, error, otpStatus } = useSelector((state: RootState) => state.userSlice);
  const isLoading = status === "loading";

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const [otpDialogVisible, setOtpDialogVisible] = React.useState(false);
  const [otp, setOtp] = React.useState<number>(0);
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setPhoneNumber(data.phone);
      await dispatch(loginAndSendOTP(data)).unwrap();
      setOtpDialogVisible(true);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleOtpChange = (value: number) => {
    setOtp(value);
  };


  const handleOtpSubmit = async () => {
    try {
      await dispatch(verifyOTPAndLogin({ number: phoneNumber, code: otp.toString() })).unwrap();
      setOtpDialogVisible(false);
      // navigate("/admin/produts")
    } catch (err) {
      console.error("OTP verification error:", err);
    }
  };

  if (user && user.role === "admin") {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <Page
      renderBody={() => (
        <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-center text-xl font-semibold text-card-foreground">Admin Sign In</h2>
          <p className="text-center text-sm text-card-foreground">Sign in to your admin account to continue</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* <FormField
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
              /> */}

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">Phone</FormLabel>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

          {/* OTP Dialog */}
          <Dialog open={otpDialogVisible} onOpenChange={() => { }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-yellow-400">Verify OTP</DialogTitle>
              </DialogHeader>
              <OtpInput length={6} otpvalue={otp} onOtpChange={handleOtpChange} />
              <Button disabled={otpStatus == "loading"} className="w-full mt-4" onClick={handleOtpSubmit}>
                Verify OTP
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      )}
    />
  );
};

export default SignInPage;

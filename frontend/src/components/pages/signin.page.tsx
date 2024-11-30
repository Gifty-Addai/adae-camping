import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { postRequest, localStorageUtil } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { SignInResponse } from "@/core/interfaces";
import { Page } from "../ui/page";
import { setUser } from "@/core/store/slice/user_slice";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      // Handle Sign-In logic (Authenticate User)
      const signInResponse = await postRequest<SignInResponse>("/api/auth/login", data);
      console.log("Sign In Response:", signInResponse);

      // Save the user data and token to localStorage and Redux
      localStorageUtil.set("user-info", signInResponse.user);
      localStorageUtil.set("token", signInResponse.token);
      dispatch(setUser(signInResponse.user));

      // Redirect based on user role
      if (signInResponse.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); 
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error with your request. Please try again.");
    }
  };

  return (
    <Page renderBody={() => (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-xl font-semibold">Sign in with email</h2>
        <p className="text-center text-sm">Sign in to your account to continue</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    )} />
  );
};

export default SignInPage;

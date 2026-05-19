import React from "react";
import { Page } from "@/components/ui/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { postRequest } from "@/lib/api-Request/api-requests";
import { toast } from "react-toastify";
import { ArrowLeft, UserPlus } from "lucide-react";

const userCreationSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"], {
    required_error: "Role is required",
  }),
});

type UserFormValues = z.infer<typeof userCreationSchema>;

const CreateUserDash: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    const toastId = toast.loading("Registering account in Akoben system...");
    try {
      await postRequest("/api/auth/signup", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      });

      toast.update(toastId, {
        render: `Successfully created user account: ${data.name}!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      navigate("/admin/users");
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "Failed to register new account.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <Page
      pageTitle="Create User"
      renderBody={() => (
        <div className="bg-[#2a2a2a] min-h-screen rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/users")}
              className="bg-transparent border-[#3d3d3d] text-gray-300 hover:bg-[#3d3d3d] w-9 h-9"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-100">Create New Account</h2>
              <p className="text-sm text-gray-400">Add an administrator or customer profile</p>
            </div>
          </div>

          <Card className="bg-[#2a2a2a] border border-[#3d3d3d] text-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#8b7355]" />
                <span>Account Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email address"
                            type="email"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            type="tel"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Temporary Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Set temporary password"
                            type="password"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Account Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11">
                              <SelectValue placeholder="Select account role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#353535] border-[#4d4d4d] text-gray-200">
                            <SelectItem value="user">Customer (Access to Web Site)</SelectItem>
                            <SelectItem value="admin">Administrator (Access to Dashboard)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#3d3d3d] mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/admin/users")}
                      className="bg-transparent border-[#4d4d4d] text-gray-300 hover:bg-[#4d4d4d] h-11 px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#8b7355] hover:bg-[#6d5a44] text-white h-11 px-8"
                    >
                      Create Account
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    />
  );
};

export default CreateUserDash;

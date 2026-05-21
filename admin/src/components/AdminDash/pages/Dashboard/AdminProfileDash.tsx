import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import { fetchUserProfile, setUser } from "@/core/store/slice/user_slice";
import { useAppDispatch } from "@/core/constants";
import { updateUserProfileAPI } from "@/lib/apiUtils";
import { toast } from "react-toastify";
import { ArrowLeft, User, MapPin, ShieldAlert, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const profileSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  streetAddress: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  gender: z.string().optional(),
  age: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().min(0, "Age cannot be negative").optional()),
  dob: z.string().optional(),
  currentPassword: z.string().optional(),
  password: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password.trim() !== "") {
    return data.currentPassword && data.currentPassword.trim() !== "";
  }
  return true;
}, {
  message: "Current password is required to change to a new password",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.password && data.password.trim() !== "") {
    return data.password.length >= 6;
  }
  return true;
}, {
  message: "New password must be at least 6 characters",
  path: ["password"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AdminProfileDash: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.userSlice);
  const [updating, setUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<ProfileFormValues | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      streetAddress: "",
      address2: "",
      city: "",
      zipCode: "",
      gender: "Prefer not to say",
      age: undefined,
      dob: "",
      currentPassword: "",
      password: "",
    },
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        streetAddress: user.streetAddress || "",
        address2: user.address2 || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        gender: user.gender || "Prefer not to say",
        age: user.age !== undefined ? user.age : undefined,
        dob: user.dob || "",
        currentPassword: "",
        password: "",
      });
    }
  }, [user, form]);

  const handlePreSubmit = (data: ProfileFormValues) => {
    setPendingData(data);
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    if (pendingData) {
      await onSubmit(pendingData);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setUpdating(true);
    const toastId = toast.loading("Updating profile details...");
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        streetAddress: data.streetAddress || undefined,
        address2: data.address2 || undefined,
        city: data.city || undefined,
        zipCode: data.zipCode || undefined,
        gender: data.gender || undefined,
        age: data.age !== undefined ? data.age : undefined,
        dob: data.dob || undefined,
      };

      if (data.password && data.password.trim() !== "") {
        payload.password = data.password;
        payload.currentPassword = data.currentPassword;
      }

      const updatedUser = await updateUserProfileAPI(payload);

      dispatch(setUser(updatedUser));

      toast.update(toastId, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Clear the password fields in the UI
      form.setValue("currentPassword", "");
      form.setValue("password", "");
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "Failed to update profile.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Page
      pageTitle="Profile Settings"
      renderBody={() => (
        <div className="bg-[#2a2a2a] min-h-screen rounded-lg p-6 max-w-4xl mx-auto pb-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/overview")}
              className="bg-transparent border-[#3d3d3d] text-gray-300 hover:bg-[#3d3d3d] w-9 h-9"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-100">My Profile</h2>
              <p className="text-sm text-gray-400">View and update your administrator details</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePreSubmit)} className="space-y-6">
              {/* Group 1: Personal Details */}
              <Card className="bg-[#2a2a2a] border border-[#3d3d3d] text-gray-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#8b7355]" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full name"
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
                            placeholder="Email address"
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
                            placeholder="Phone number"
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "Prefer not to say"}>
                          <FormControl>
                            <SelectTrigger className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#353535] border-[#4d4d4d] text-gray-200">
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Age</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Age"
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Date of Birth"
                            type="date"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Group 2: Address Details */}
              <Card className="bg-[#2a2a2a] border border-[#3d3d3d] text-gray-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#8b7355]" />
                    <span>Address Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Street Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Street Address Line 1"
                              {...field}
                              className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Address Line 2</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Apartment, suite, unit, building, floor, etc."
                              {...field}
                              className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City"
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
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Zip / Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Zip code"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Group 3: Security & Password Update */}
              <Card className="bg-[#2a2a2a] border border-[#3d3d3d] text-gray-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-[#8b7355]" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Current Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter current password to authorize changes"
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter new password (leave blank to keep current)"
                            type="password"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <p className="text-xs text-gray-400 mt-1">
                          Only enter a password if you wish to change your current one.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#3d3d3d]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/overview")}
                  className="bg-transparent border-[#4d4d4d] text-gray-300 hover:bg-[#4d4d4d] h-11 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isDirty || updating}
                  className="bg-[#8b7355] hover:bg-[#6d5a44] disabled:opacity-50 disabled:cursor-not-allowed text-white h-11 px-8 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>

          {/* Save Confirmation Dialog */}
          {showConfirm && (
            <Dialog open={showConfirm} onOpenChange={(open) => { if (!open) setShowConfirm(false); }}>
              <DialogContent className="w-full max-w-sm mx-auto bg-[#2a2a2a] border border-[#3d3d3d] text-gray-100 shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-100 font-bold text-lg">Confirm Changes</DialogTitle>
                  <DialogDescription className="text-gray-400 mt-2">
                    Are you sure you want to save these changes to your profile?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="bg-[#3d3d3d] hover:bg-[#4d4d4d] text-gray-200 border-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmSave}
                    className="bg-[#8b7355] hover:bg-[#6d5a44] text-white border-none"
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    />
  );
};

export default AdminProfileDash;

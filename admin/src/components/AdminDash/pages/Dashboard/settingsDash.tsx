import React, { useEffect } from "react";
import { Page } from "@/components/ui/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettingsAPI } from "@/hooks/settings.hook";
import { toast } from "react-toastify";
import { Settings as SettingsIcon, Save, RefreshCw } from "lucide-react";
import Textarea from "@/components/ui/textarea";

const settingsValidationSchema = z.object({
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  supportEmail: z.string().email("Invalid email address").min(1, "Support email is required"),
  supportPhone: z.string().min(1, "Support phone number is required"),
  promoMessage: z.string().min(1, "Promo message is required"),
  promoEnabled: z.boolean(),
  instagramLink: z.string().url("Invalid URL").or(z.literal("")),
  linkedinLink: z.string().url("Invalid URL").or(z.literal("")),
});

type SettingsFormValues = z.infer<typeof settingsValidationSchema>;

const AdminSettingsDash: React.FC = () => {
  const { getSettings, updateSettings, loading } = useSettingsAPI();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsValidationSchema),
    defaultValues: {
      whatsappNumber: "",
      supportEmail: "",
      supportPhone: "",
      promoMessage: "",
      promoEnabled: true,
      instagramLink: "",
      linkedinLink: "",
    },
  });

  const loadSettingsData = async () => {
    const data = await getSettings();
    if (data) {
      form.reset({
        whatsappNumber: data.whatsappNumber || "",
        supportEmail: data.supportEmail || "",
        supportPhone: data.supportPhone || "",
        promoMessage: data.promoMessage || "",
        promoEnabled: data.promoEnabled !== undefined ? data.promoEnabled : true,
        instagramLink: data.instagramLink || "",
        linkedinLink: data.linkedinLink || "",
      });
    }
  };

  useEffect(() => {
    loadSettingsData();
  }, []);

  const onSubmit = async (values: SettingsFormValues) => {
    const toastId = toast.loading("Updating configurations...");
    const result = await updateSettings(values);
    if (result) {
      toast.update(toastId, {
        render: "Settings updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render: "Failed to update settings.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <Page
      pageTitle="System Settings"
      renderBody={() => (
        <div className="bg-[#2a2a2a] min-h-screen rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">System Settings</h2>
              <p className="text-sm text-gray-400">Manage contact information, emails, and promotion alerts</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={loadSettingsData}
              disabled={loading}
              className="bg-transparent border-[#3d3d3d] text-gray-300 hover:bg-[#3d3d3d] w-9 h-9"
              title="Refresh settings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <Card className="bg-[#2a2a2a] border border-[#3d3d3d] text-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#8b7355]" />
                <span>Global Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">WhatsApp Checkout Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 233247413964"
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-11"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400 text-xs">
                          The WhatsApp number (including country code, without + or spaces) that customers redirect to on checkout.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Support Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. info@ancestraltallow.gh"
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
                    name="supportPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Support Phone / Call Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. +233 24 741 3964"
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
                    name="instagramLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Instagram Profile Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. https://www.instagram.com/yourprofile"
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
                    name="linkedinLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">LinkedIn Company Page Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. https://linkedin.com/company/yourcompany"
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
                    name="promoMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Promo Banner Alert Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter promotional message alert details..."
                            {...field}
                            className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="promoEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#3d3d3d] p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base text-gray-200">Enable Promo Banner</FormLabel>
                          <FormDescription className="text-gray-400 text-xs">
                            Control whether the promotional alert banner is visible to users on the home/landing page.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#3d3d3d] mt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#8b7355] hover:bg-[#6d5a44] text-white h-11 px-8 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
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

export default AdminSettingsDash;

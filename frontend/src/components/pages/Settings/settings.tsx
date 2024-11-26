import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import UserBookingsPage from "../Bookings/user_book_page";

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("Profile");

    const renderContent = () => {
        switch (activeTab) {
            case "Profile":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                        <Separator className="mb-4" />
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex gap-2">
                                <Button >Change picture</Button>
                                <Button variant="destructive">Delete picture</Button>
                            </div>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Profile Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter your profile name"
                                    defaultValue="Kevin Heart"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <Input
                                    type="text"
                                    placeholder="@kevinunhuy"
                                    disabled
                                    defaultValue="@kevinunhuy"
                                    className="bg-gray-200"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Available change in 25/04/2024
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status Recently
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter your status"
                                    defaultValue="On duty"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    About Me
                                </label>
                                <textarea
                                    placeholder="Tell us about yourself"
                                    defaultValue="Discuss only on work hour, unless you wanna discuss about music 🎵"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    rows={3}
                                />
                            </div>
                            <Button variant="default" className="mt-4 w-full">
                                Save changes
                            </Button>
                        </form>
                    </div>
                );
           
            case "Appearance":
                return <p className="p-6">Appearance settings content...</p>;
        
            case "Bookings":
                return <UserBookingsPage/>
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen mt-16">
            {/* Sidebar */}
            <div className="w-64 bg-gray-100 p-6">
                <h2 className="text-lg font-bold mb-6">Settings</h2>
                <nav className="space-y-2">
                    {["Profile", "Appearance","Bookings"].map(
                        (tab) => (
                            <button
                                key={tab}
                                className={`w-full text-left p-2 rounded-md ${activeTab === tab ? "bg-blue-100 text-blue-700" : "text-gray-700"
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <ChevronRight name="chevron-right" className="mr-2 inline" />
                                {tab}
                            </button>
                        )
                    )}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white">
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsPage;

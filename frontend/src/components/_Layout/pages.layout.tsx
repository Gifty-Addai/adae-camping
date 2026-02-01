import { Outlet } from "react-router-dom";
import { MenuBar } from "../ui/navigation/menu_navigation";
import Footer from "../ui/footer";
import React from "react";

type VerifiedLayout = {
  auth: boolean
}

export const VerifiedLayout: React.FC<VerifiedLayout> = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      {/* Navigation Menu */}
      <MenuBar />

      {/* Main Content Area */}
      <main className="flex-1 pt-32">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

import { Outlet } from "react-router-dom";
import { MenuBar } from "../ui/navigation/menu_navigation";
import Footer from "../ui/footer";
import React from "react";

type VerifiedLayout = {
  auth: boolean
}

export const VerifiedLayout: React.FC<VerifiedLayout> = () => {
  return (
    <>
      {/* Navigation Menu */}
      <MenuBar />

      {/* Main Content Area */}
      <div className="pt-32">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />

    </>
  );
};

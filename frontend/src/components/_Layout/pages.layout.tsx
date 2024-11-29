import { Outlet } from "react-router-dom";
import { MenuBar } from "../ui/navigation/menu_navigation";
import Footer from "../ui/footer";
import React from "react";

type VerifiedLayout ={
  auth:boolean
}

export const VerifiedLayout : React.FC<VerifiedLayout> = ({auth}) => {
  return (
    <>
      {/* Navigation Menu */}
      <MenuBar auth={auth}/>
      
      {/* Main Content Area */}
      <div>
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />

    </>
  );
};

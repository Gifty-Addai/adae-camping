import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../AdminDash/AdComponents/side_bar";
import Header from "../AdminDash/AdComponents/header";

type AdminLayout ={
  auth:boolean
}

export const AdminLayout : React.FC<AdminLayout> = ({ }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    
    <>
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          {/* <main> */}
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Outlet />
            </div>
          {/* </main> */}
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
    
      {/* Navigation Menu */}
      {/* <MenuBar auth={auth}/> */}
      
      {/* Main Content Area */}
      {/* <div>
       
      </div> */}

      {/* Footer */}
      {/* <Footer />

      <SignInModal /> */}

    </>
  );
};

// src/components/AdminDash/layout/AdminLayout.tsx

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "../AdminDash/AdComponents/side_bar";
import Breadcrumbs from "../AdminDash/pages/trip/admin-breadcumb";

export default function AdminLayout() {
  return (
    <div className="bg-[#2a2a2a] min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#2a2a2a]">
          <header className="flex h-16 shrink-0 z-50 items-center gap-2 transition-[width,height] ease-linear fixed group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-[#1d1d1d] border-b border-[#3d3d3d]">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1 text-gray-300" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-[#5d5d5d]" />
              <Breadcrumbs />
            </div>
          </header>
          <main className="p-4 mt-16">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

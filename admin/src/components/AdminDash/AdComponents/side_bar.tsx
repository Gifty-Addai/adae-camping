// src/components/AdminDash/layout/AppSidebar.tsx

"use client";

import React from "react";
import { matchPath, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { breadcrumbConfig, BreadcrumbConfigItem } from "../pages/trip/breadcumbConfig";
import { NavMain } from "./nav_main";
import { NavUser } from "./nav_user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const pathname = location.pathname;

  const updateActiveState = (config: BreadcrumbConfigItem[]): BreadcrumbConfigItem[] => {
    return config.map((item) => {
      const isActive = matchPath({ path: item.url, end: false }, pathname) !== null;
      const updatedItem = { ...item, isActive };

      if (item.children) {
        updatedItem.children = updateActiveState(item.children);
      }

      return updatedItem;
    });
  };

  const updatedBreadcrumbConfig = React.useMemo(() => updateActiveState(breadcrumbConfig), [pathname]);

  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-[#1d1d1d] border-r border-[#3d3d3d]" {...props}>
      <SidebarContent className="bg-[#1d1d1d]">
        {/* Main Navigation using updated breadcrumbConfig */}
        <NavMain items={updatedBreadcrumbConfig} />
      </SidebarContent>

      <SidebarFooter className="bg-[#1d1d1d] border-t border-[#3d3d3d]">
        {/* User Info / Profile */}
        <NavUser />
      </SidebarFooter>

      {/* SidebarRail: the condensed version of the sidebar */}
      <SidebarRail className="bg-[#2a2a2a]" />
    </Sidebar>
  );
}

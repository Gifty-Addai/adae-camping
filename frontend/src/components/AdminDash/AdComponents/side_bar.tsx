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

  React.useEffect(() => {
    console.log("sidebar initialized");
  }, []);

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarContent>
        {/* Main Navigation using updated breadcrumbConfig */}
        <NavMain items={updatedBreadcrumbConfig} />
      </SidebarContent>

      <SidebarFooter>
        {/* User Info / Profile */}
        <NavUser />
      </SidebarFooter>

      {/* SidebarRail: the condensed version of the sidebar */}
      <SidebarRail />
    </Sidebar>
  );
}

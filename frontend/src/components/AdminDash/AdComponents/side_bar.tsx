// src/AdminDash/AdComponents/side_bar.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FocusTrap from "focus-trap-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLDivElement | null>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(
    storedSidebarExpanded === "true"
  );

  // Close sidebar when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (!sidebar.current || !trigger.current) return;
  //     if (
  //       !sidebarOpen ||
  //       sidebar.current.contains(event.target as Node) ||
  //       trigger.current.contains(event.target as Node)
  //     ) {
  //       return;
  //     }
  //     setSidebarOpen(false);
  //   };
  //   document.addEventListener("click", handleClickOutside);
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, [sidebarOpen, setSidebarOpen]);

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (sidebarOpen && event.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen, setSidebarOpen]);

  // Handle sidebar expanded state
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", String(sidebarExpanded));
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  console.log("value in sidebar",sidebarOpen)

  return (
    <FocusTrap active={sidebarOpen} focusTrapOptions={{ initialFocus: false, allowOutsideClick: true }}>
      <aside
        ref={sidebar}
        id="sidebar"
        role="navigation"
        aria-label="Main Sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col bg-card text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          trigger={trigger}
        />
        <div className="flex flex-col px-4 py-4">
          <SidebarSection title="MENU">
            <SidebarItemGroup
              title="Dashboard"
              icon={<Icons.settings className="h-5 w-5" />}
              active={pathname.includes("dashboard")}
              expanded={sidebarExpanded}
              setExpanded={setSidebarExpanded}
              links={[
                { to: "/dashboard/overview", label: "Overview" },
                { to: "/admin/productDash", label: "Products" },
              ]}
            />
            <SidebarItem
              to="/calendar"
              icon={<Icons.profile className="h-5 w-5" />}
              label="Calendar"
              active={pathname.includes("calendar")}
            />
          </SidebarSection>
          {/* Add more sections or items as needed */}
        </div>
      </aside>
    </FocusTrap>
  );
};

export default Sidebar;

// Sidebar Header
const SidebarHeader: React.FC<{
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  trigger: React.RefObject<HTMLButtonElement>;
}> = ({ sidebarOpen, setSidebarOpen, trigger }) => (
  <div className="flex items-center justify-between px-6 py-5">
    <Link to="/admin/productDash" className="flex items-center no-underline">
      <span className="ml-3 text-lg text-card-foreground font-semibold">FieNeFie</span>
    </Link>
    <Button
      ref={trigger}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="lg:hidden"
      aria-controls="sidebar"
      aria-expanded={sidebarOpen}
      aria-label="Close Sidebar"
    >
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </Button>
  </div>
);

// Sidebar Section
const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="my-4 ml-4 text-2xl font-semibold text-card-foreground">{title}</h3>
    <ul className="space-y-2 text-card-foreground">{children}</ul>
  </div>
);

// Sidebar Item Group
const SidebarItemGroup: React.FC<{
  title: string;
  icon: React.ReactNode;
  active: boolean;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  links: { to: string; label: string }[];
}> = ({ title, icon, active, expanded, setExpanded, links }) => (
  <li>
    <Button
      onClick={() => setExpanded(!expanded)}
      className={`flex w-full items-center rounded-md justify-between px-4 py-2 focus:outline-none focus:ring ${
        active ? "text-white" : "text-white hover:bg-primary"
      }`}
      aria-expanded={expanded}
      aria-controls={`${title}-submenu`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <Label className="text-lg font-semibold no-underline text-card-foreground">{title}</Label>
      </div>
      {expanded ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
    {expanded && (
      <ul id={`${title}-submenu`} className="mt-2 space-y-2 pl-6">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="block text-gray-400 no-underline hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </li>
);

// Sidebar Single Item
const SidebarItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}> = ({ to, icon, label, active }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-md focus:outline-none focus:ring ${
        active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

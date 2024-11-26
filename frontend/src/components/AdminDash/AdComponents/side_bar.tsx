import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(event.target as Node) ||
        trigger.current.contains(event.target as Node)
      ) {
        return;
      }
      setSidebarOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

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

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col bg-primary-foreground text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
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
              { to: "/dashboard/analytics", label: "Analytics" },
            ]}
          />
          <SidebarItem
            to="/calendar"
            icon={<Icons.profile className="h-5 w-5" />}
            label="Calendar"
            active={pathname.includes("calendar")}
          />
        </SidebarSection>

        <SidebarSection title="OTHERS">
          <SidebarItemGroup
            title="Authentication"
            icon={<Icons.profile className="h-5 w-5" />}
            active={pathname.includes("auth")}
            expanded={sidebarExpanded}
            setExpanded={setSidebarExpanded}
            links={[
              { to: "/auth/signin", label: "Sign In" },
              { to: "/auth/signup", label: "Sign Up" },
            ]}
          />
          <SidebarItem
            to="/chart"
            icon={<Icons.profile className="h-5 w-5" />}
            label="Chart"
            active={pathname.includes("chart")}
          />
        </SidebarSection>
      </div>
    </aside>
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
    <Link to="/" className="flex items-center no-underline">
      <Icons.mapPin className="h-6 w-6 text-white" />
      <span className="ml-3 text-lg font-semibold">Brand</span>
    </Link>
    <Button
      ref={trigger}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="lg:hidden"
      aria-controls="sidebar"
      aria-expanded={sidebarOpen}
    >
      <Icons.bell className="h-6 w-6 text-white" />
    </Button>
  </div>
);

// Sidebar Section
const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="my-4 ml-4 text-2xl font-semibol">{title}</h3>
    <ul className="space-y-2 text-white">{children}</ul>
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
    <button
      onClick={() => setExpanded(!expanded)}
      className={`flex w-full items-center rounded-md justify-between px-4 py-2 ${
        active ? " text-white" : "text-white hover:bg-primary"
      }`}
    >
      <div className="flex items-center gap-2">
        {icon} <Label className="text-lg font-semibold">{title}</Label>
        {/* <span>{title}</span> */}
      </div>
      {expanded ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </button>
    {expanded && (
      <ul className="mt-2 space-y-2 pl-6">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="hover:text-white transition-colors"
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
      className={`flex items-center gap-2 px-4 py-2 ${
        active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

import React from 'react';
import { Button } from '@/components/ui/button';
import DropdownUser from './dropdown-user';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-50 flex w-full bg-card shadow dark:bg-boxdark">
      <div className="flex w-full items-center justify-between px-4 py-4 md:px-6 xl:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Hamburger Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={sidebarOpen}
            aria-label="Toggle Sidebar"
            onClick={() => {
              setSidebarOpen(!sidebarOpen)
              console.log("value in heade",!sidebarOpen)
            }}
          >
            <svg
              className={`h-6 w-6 transition-transform duration-300 ${
                sidebarOpen ? 'transform rotate-45' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </Button>

          {/* Logo (Optional) */}
          {/* <Link to="/" className="block lg:hidden">
            <img src={Images.AcsLogo} alt="Logo" className="h-8 w-auto" />
          </Link> */}
        </div>

        {/* Search Bar (Optional) */}
        {/* <div className="hidden sm:flex items-center flex-grow">
          ... 
        </div> */}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Dropdown */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;

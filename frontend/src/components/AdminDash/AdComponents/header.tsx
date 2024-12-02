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
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className={`transition-transform ${
                sidebarOpen ? 'rotate-45' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </Button>

          {/* Logo */}
          {/* <Link to="/" className="block lg:hidden">
            <img src={Images.AcsLogo} alt="Logo" className="h-8 w-auto" />
          </Link> */}
        </div>

        {/* Search Bar */}
        {/* <div className="hidden sm:flex items-center flex-grow">
          <form className="w-full">
            <div className="relative">
              <Input
                type="text"
                placeholder="Type to search..."
                className="pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16l-4 4m0 0l4-4m-4 4V4m0 4h4"
                  />
                </svg>
              </span>
            </div>
          </form>
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

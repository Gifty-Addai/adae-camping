import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, Monitor } from "lucide-react"; // Icons for hamburger, close, and theme
import { Button } from "../button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../navigation-menu"; // Using the NavigationMenu components
import { AuthType } from "@/core/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { useModal } from "@/context/signIn_modal_context";

const MobileMenu: React.FC<AuthType> = ({auth}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("System");
  const { setSignIn } = useModal();


  // Function to handle theme switching
  const switchTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    // Optionally add logic here to apply theme (e.g., set a CSS class)
  };

  return (
    <div className="flex justify-between w-full">
      <div className="flex items-center space-x-4">
        <img
          // src={Images.AcsLogo}
          alt="Logo"
          className="h-8 w-8"
        />
        <div className="text-lg font-bold text-white">Adae Camping</div>
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <Button
          className="text-white focus:outline-none"
          onClick={() => setIsOpen(true)}
          size={"icon"}
        >
          <Menu className="h-3 w-3" />
        </Button>
      </div>

      {/* Fullscreen Modal Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-primary-foreground bg-opacity-95 z-50 text-white flex justify-center items-center">
          <Button
            className="absolute top-4 right-4 focus:outline-none"
            onClick={() => setIsOpen(false)}
            size={"icon"}

          >
            <X className="h-3 w-3" />
          </Button>

            {auth ? (
              <Link to="/profile">
                <Avatar>
                  <AvatarImage src="path/to/user/avatar.png" alt="User Avatar" />
                  <AvatarFallback>UA</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button className="text-white" onClick={() => setSignIn(true)}>
                Sign In
              </Button>
            )}

          {/* Centered Content */}
          <div className="flex flex-col items-center space-y-6 p-6 text-lg">
            {/* Navigation Links */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Camping Guides</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4">
                      <li>
                        <Link to="/docs" className="hover:text-gray-400">
                          Introduction
                        </Link>
                      </li>
                      <li>
                        <Link to="/docs/locations" className="hover:text-gray-400">
                          Locations
                        </Link>
                      </li>
                      <li>
                        <Link to="/docs/gear-checklist" className="hover:text-gray-400">
                          Gear Checklist
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4">
                      <li>
                        <Link to="/docs" className="hover:text-gray-400">
                          Documentation
                        </Link>
                      </li>
                      <li>
                        <Link to="/blog" className="hover:text-gray-400">
                          Blog
                        </Link>
                      </li>
                      <li>
                        <Link to="/showcase" className="hover:text-gray-400">
                          Showcase
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            
          </div>

          {/* Theme Switcher Section */}
          <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between border-t border-gray-700 pt-4">
            <span>Switch theme</span>
            <div className="flex items-center space-x-2">
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-md ${theme === "Light" ? "bg-gray-700" : ""
                  }`}
                onClick={() => switchTheme("Light")}
                aria-label="Light Theme"
              >
                <Sun className="h-5 w-5" />
              </button>
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-md ${theme === "System" ? "bg-gray-700" : ""
                  }`}
                onClick={() => switchTheme("System")}
                aria-label="System Theme"
              >
                <Monitor className="h-5 w-5" />
              </button>
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-md ${theme === "Dark" ? "bg-gray-700" : ""
                  }`}
                onClick={() => switchTheme("Dark")}
                aria-label="Dark Theme"
              >
                <Moon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;

import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for hamburger and close
import { Button } from "../button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../navigation-menu";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // Close the menu on navigation
  };

  return (
    <div className="flex justify-between w-full">
      <div className="flex items-center space-x-4">
        <img
          // src={Images.AcsLogo}
          alt="Logo"
          className="h-8 w-8"
        />
        <Link to={"/"}>
          <div className="text-lg font-bold text-white">Adae Camping</div>
        </Link>
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

      {isOpen && (
        <div className="fixed inset-0 bg-card bg-opacity-95 z-50 text-white flex justify-center items-center">
          <Button
            className="absolute top-4 right-4 focus:outline-none"
            onClick={() => setIsOpen(false)}
            size={"icon"}
          >
            <X className="h-3 w-3" />
          </Button>

          <div className="flex flex-col items-center space-y-6 p-6 text-lg">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/gallery" onClick={handleLinkClick}>
                    <Button>
                      Gallery
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <Link to="/products" onClick={handleLinkClick}>
                  <Button>
                    Shop Gears
                  </Button>
                </Link>
              </NavigationMenuList>
              
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Camping Guides</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4">
                      <li>
                        <Link to="/docs" className="hover:text-gray-400" onClick={handleLinkClick}>
                          Introduction
                        </Link>
                      </li>
                      <li>
                        <Link to="/docs/locations" className="hover:text-gray-400" onClick={handleLinkClick}>
                          Locations
                        </Link>
                      </li>
                      <li>
                        <Link to="/docs/gear-checklist" className="hover:text-gray-400" onClick={handleLinkClick}>
                          Gear Checklist
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;

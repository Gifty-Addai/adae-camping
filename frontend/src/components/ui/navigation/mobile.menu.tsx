import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "../button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../navigation-menu";
import { Label } from "../label";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex justify-between items-center w-full px-4 py-3 bg-transparent shadow-md">
      {/* Logo Section */}
      <Link to="/" className="flex items-center no-underline">
        <div className="flex items-center h-10 justify-center rounded-lg bg-yellow-300 px-3 py-2">
          <Label className="text-lg font-bold text-black">FieNeFie</Label>
        </div>
      </Link>

      {/* Menu Button */}
      <Button
        className="text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 text-white flex flex-col">
          {/* Close Button */}
          <div className="flex justify-between items-center px-6 py-4">
            <Link to="/cart">
              <Button
                className="text-white focus:outline-none"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart size={24} />
              </Button>
            </Link>
            <Button
              className="text-white focus:outline-none"
              onClick={() => setIsOpen(false)}
              size="icon"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-grow flex flex-col items-center justify-center space-y-6 text-lg">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col items-center space-y-6">
                {/* <NavigationMenuItem>
                  <Link to="/features" onClick={handleLinkClick} className="text-center">
                    <Button className="w-40 py-2 px-4 rounded-full" variant={"secondary"}>
                      Shop Gears
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/use-cases" onClick={handleLinkClick} className="text-center">
                    <Button className="w-40 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
                      Use Cases
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about-us" onClick={handleLinkClick} className="text-center">
                    <Button className="w-40 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
                      About Us
                    </Button>
                  </Link>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                  <Link to="/products" onClick={handleLinkClick} className="text-center">
                    <Button className="w-40  py-2 px-4 rounded-full" variant={"secondary"}>
                      Products
                    </Button>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Footer Section */}
          <div className="py-4 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FieNeFie. All Rights Reserved.
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;

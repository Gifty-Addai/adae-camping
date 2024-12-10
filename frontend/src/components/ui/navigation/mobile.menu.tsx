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
    <div className="flex justify-between w-full">
      <Link to="/" className="no-underline items-center">
        <div className="flex justify-center items-center rounded-lg bg-yellow-300">
          {/* <img
      // src={Images.AcsLogo}
      alt="Logo"
      className="h-8 w-8"
    /> */}
          <Label className="text-lg w-28 font-bold text-black text-center">
            FieNeFie
          </Label>
        </div>
      </Link>

      <div className="flex items-center space-x-4 ml-auto">
        {/* <Link to={"/cart"}>
          <Button
            onClick={() => setIsOpen(false)}
            size={"icon"}
            className="bg-gray-400"
          >
            <ShoppingCart size={12} />
          </Button>
        </Link> */}
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
          {/* Cart Icon on the top-left */}
          <Link to={"/cart"}>
            <Button
              onClick={() => setIsOpen(false)}

              className="absolute bg-gray-400 top-4 left-4 p-2 "
            >
              <ShoppingCart size={24} />
            </Button>
          </Link>

          {/* Close Button on the top-right */}
          <Button
            className="absolute top-4 right-4 focus:outline-none"
            onClick={() => setIsOpen(false)}
            size={"icon"}
          >
            <X className="h-3 w-3" />
          </Button>

          <div className="flex flex-col space-y-6 p-6 text-lg">
            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col space-y-4">
                {/* <NavigationMenuItem>
                  <Link to="/gallery" onClick={handleLinkClick}>
                    <Button className="w-full sm:w-auto">
                      Gallery
                    </Button>
                  </Link>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                  <Link to="/products" onClick={handleLinkClick}>
                    <Button className="w-full sm:w-auto">
                      Shop Gears
                    </Button>
                  </Link>
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

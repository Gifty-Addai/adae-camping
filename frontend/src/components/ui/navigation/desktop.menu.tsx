import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "../navigation-menu";
import { Button } from "../button";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";

const DesktopMenu: React.FC = () => {
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-2 w-full">
      {/* Logo Section */}
      <Link to="/" className="flex items-center no-underline">
        <div className="flex items-center justify-center rounded-lg bg-yellow-300 px-3 py-2">
          <span className="text-lg font-bold text-black">FieNeFie</span>
        </div>
      </Link>

      {/* Navigation Menu */}
      <NavigationMenu className="ml-auto space-x-8">
        <NavigationMenuList className="flex space-x-6">
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="p-4 grid gap-3 md:w-[300px] lg:w-[400px]">
                <li className="text-gray-700 font-medium">Feature 1</li>
                <li className="text-gray-700 font-medium">Feature 2</li>
                <li className="text-gray-700 font-medium">Feature 3</li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Use Cases</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="p-4 grid gap-3 md:w-[300px] lg:w-[400px]">
                <li className="text-gray-700 font-medium">Use Case 1</li>
                <li className="text-gray-700 font-medium">Use Case 2</li>
                <li className="text-gray-700 font-medium">Use Case 3</li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}

          <NavigationMenuItem>
            <Link to="/products" className="no-underline font-medium text-yellow-400">
              Products
            </Link>
          </NavigationMenuItem>
          {/* 
          <NavigationMenuItem>
            <Link to="/customers" className="no-underline font-medium text-gray-700">
              Customers
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/about-us" className="no-underline font-medium text-gray-700">
              About Us
            </Link>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Cart & Get Started */}
      <div className="flex items-center px-8">
        <Link to="/cart">
          <Button variant="ghost" size={"icon"} className="relative">
            <ShoppingCart color="white" size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>

        {/* <Link to="/ASGSDWSDZ-234ADFSDAS/trip">
          <Button className="ml-10">
            Adventure With Us
          </Button>
        </Link> */}
      </div>
    </div>
  );
};

export default DesktopMenu;

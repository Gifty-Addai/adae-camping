import { Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import { useState } from "react";
import { Input } from "../input";

const DesktopMenu: React.FC = () => {
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-[#1d1d1d] border-b border-[#2d2d2d]">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Left Navigation */}
          <nav className="flex items-center gap-6 flex-1">
            <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-gray-300 hover:text-white font-medium transition-colors">
              Shop
            </Link>
            <Link to="/blog" className="text-gray-300 hover:text-white font-medium transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white font-medium transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white font-medium transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Centered Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="h-12 flex items-center justify-center">
              {/* Brand Logo - inverted for dark background */}
              <img
                src="/logo.png"
                alt="The Ancestral Tallow"
                className="h-14 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Right Section: Search, User, Cart */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search product here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-gray-500 w-64 focus:border-white focus:ring-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black p-1.5 rounded hover:bg-gray-200 transition-colors">
                <Search size={16} />
              </button>
            </div>

            {/* User Icon */}
            <Link to="/account" className="text-gray-300 hover:text-white transition-colors">
              <User size={24} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopMenu;

import { Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import { useState } from "react";
import SearchModal from "./search-modal";
import { CartDrawer } from "@/components/pages/Cart/cart-drawer";

const DesktopMenu: React.FC = () => {
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="bg-[#1d1d1d] border-b border-[#2d2d2d]">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Left Navigation */}
          <nav className="flex items-center gap-6 flex-1">
            <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-white font-medium transition-colors">
              Shop
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
            {/* Search Bar Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 bg-[#2a2a2a] border border-[#3a3a3a] text-gray-400 px-4 py-2 rounded-full hover:border-gray-500 hover:text-white transition-all w-64 group"
            >
              <Search size={16} className="text-gray-500 group-hover:text-white transition-colors" />
              <span className="text-sm">Search tallow products...</span>
            </button>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* User Icon */}
            <Link to="/account" className="text-gray-300 hover:text-white transition-colors">
              <User size={24} />
            </Link>

            {/* Cart Drawer Trigger */}
            <CartDrawer>
              <div className="relative text-gray-300 hover:text-white transition-colors cursor-pointer">
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </div>
            </CartDrawer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopMenu;

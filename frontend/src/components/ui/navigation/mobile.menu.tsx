import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingCart, X, Search } from "lucide-react";
import { Button } from "../button";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import SearchModal from "./search-modal";
import { CartDrawer } from "@/components/pages/Cart/cart-drawer";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex justify-between items-center w-full px-4 py-3 bg-[#1d1d1d] border-b border-[#2d2d2d]">
      {/* Logo Section */}
      <Link to="/" className="flex items-center no-underline">
        <img
          src="/logo.png"
          alt="The Ancestral Tallow"
          className="h-10 w-auto object-contain"
        />
      </Link>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <Button
          className="text-white focus:outline-none bg-transparent hover:bg-[#2a2a2a] p-2"
          onClick={() => setIsSearchOpen(true)}
          size="icon"
        >
          <Search size={24} className="text-gray-300 hover:text-white" />
        </Button>

        {/* Cart Drawer Trigger */}
        <CartDrawer>
          <div className="relative text-gray-300 hover:text-white transition-colors cursor-pointer p-2">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </div>
        </CartDrawer>

        {/* Menu Button */}
        <Button
          className="text-white focus:outline-none bg-transparent hover:bg-[#2a2a2a]"
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Drawer - Slides from Left */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#1d1d1d] border-r border-[#2d2d2d] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2d2d2d]">
          <Link to="/" onClick={handleLinkClick}>
            <img
              src="/logo.png"
              alt="The Ancestral Tallow"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Button
            className="text-white focus:outline-none bg-transparent hover:bg-[#2a2a2a]"
            onClick={() => setIsOpen(false)}
            size="icon"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col px-6 py-8 space-y-6">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="text-gray-300 hover:text-white text-lg font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={handleLinkClick}
            className="text-gray-300 hover:text-white text-lg font-medium transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/about"
            onClick={handleLinkClick}
            className="text-gray-300 hover:text-white text-lg font-medium transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className="text-gray-300 hover:text-white text-lg font-medium transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/faq"
            onClick={handleLinkClick}
            className="text-gray-300 hover:text-white text-lg font-medium transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full py-4 px-6 text-center text-sm text-gray-400 border-t border-[#2d2d2d]">
          &copy; {new Date().getFullYear()} The Ancestral Tallow
        </div>
      </div>

      {/* Overlay - Closes menu when clicked */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MobileMenu;

import { Outlet } from "react-router-dom";
import { MenuBar } from "../ui/navigation/menu_navigation";
import Footer from "../ui/footer";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";
import { CartDrawer } from "../pages/Cart/cart-drawer";
import { ShoppingCart } from "lucide-react";

type VerifiedLayout = {
  auth: boolean
}

export const VerifiedLayout: React.FC<VerifiedLayout> = () => {
  const { totalItems, totalPrice } = useSelector((state: RootState) => state.cart);
  const [animate, setAnimate] = useState(false);

  // Trigger bouncy pop animation when item count changes
  useEffect(() => {
    if (totalItems > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const formattedPrice = totalPrice % 1 === 0 ? totalPrice.toFixed(0) : totalPrice.toFixed(2);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      {/* Dynamic Spring Pop-in style for catchy effect */}
      <style>{`
        @keyframes cartPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-cart-pop {
          animation: cartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>

      {/* Navigation Menu */}
      <MenuBar />

      {/* Main Content Area */}
      <main className="flex-1 pt-32">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Catchy Floating Cart - Visible on all screen sizes */}
      {totalItems > 0 && (
        <div className="fixed top-24 right-6 md:top-28 md:right-8 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
          <CartDrawer>
            <button
              className={`flex items-center gap-3 bg-white/95 backdrop-blur-md border border-[#4A6741]/20 px-5 py-2.5 rounded-full shadow-[0_20px_45px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(74,103,65,0.3)] hover:border-[#4A6741]/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none group ${animate ? "animate-cart-pop" : ""
                }`}
            >
              {/* Cart Icon & Item Count Badge */}
              <div className="relative flex items-center justify-center">
                <ShoppingCart
                  color="black"
                  size={20}
                  className="group-hover:rotate-[-8deg] group-hover:scale-105 transition-transform duration-300"
                  strokeWidth={2}
                />
                <span className="absolute -top-2.5 -right-2.5 bg-[#4A6741] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold border border-white shadow-sm transition-all duration-300">
                  {totalItems}
                </span>
              </div>

              {/* Elegant thin divider */}
              <span className="h-4 w-px bg-neutral-200" />

              {/* Total Price & Pulse Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-[#1a1a1a] font-semibold text-sm tracking-wide whitespace-nowrap">
                  GHS {formattedPrice}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A6741] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A6741]"></span>
                </span>
              </div>
            </button>
          </CartDrawer>
        </div>
      )}
    </div>
  );
};


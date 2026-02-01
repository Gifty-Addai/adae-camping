
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "../../ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/core/store/store";
import { addToCart, removeItem, decreaseQuantity } from "@/core/store/slice/cart.slice";
import { Link } from "react-router-dom";
import { useState } from "react";


interface CartDrawerProps {
    children?: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
    const dispatch = useDispatch();
    const { items, totalPrice, totalItems } = useSelector((state: RootState) => state.cart);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children || (
                    <div className="relative text-gray-300 hover:text-white transition-colors cursor-pointer">
                        <ShoppingCart size={24} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                {totalItems}
                            </span>
                        )}
                    </div>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[#1d1d1d] border-l border-[#2d2d2d] p-0 flex flex-col h-full">
                <SheetHeader className="px-6 py-4 border-b border-[#2d2d2d] flex flex-row items-center justify-between space-y-0">
                    <SheetTitle className="text-xl font-serif text-gray-100">Your Cart</SheetTitle>
                    {/* Close button is handled by Sheet primitive, sticking to design */}
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <ShoppingCart className="h-16 w-16 text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">Your cart is empty</h3>
                        <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="bg-[#4A6741] hover:bg-[#3a5232] text-white"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 px-6">
                            <div className="py-6 space-y-6">
                                {items.map((item) => (
                                    <div key={item._id} className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-[#2d2d2d] bg-[#2a2a2a]">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-base font-medium text-gray-200 line-clamp-1">{item.name}</h3>
                                                    {/* Variant removed as not in interface */}
                                                </div>
                                                <p className="text-base font-medium text-[#d4c5a9]">
                                                    GHS {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center border border-[#3d3d3d] rounded-full">
                                                    <button
                                                        onClick={() => dispatch(decreaseQuantity({ _id: item._id }))}
                                                        className="p-2 hover:text-white text-gray-400 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-2 font-medium text-gray-200 min-w-[20px] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => dispatch(addToCart({ product: item, quantity: 1 }))}
                                                        className="p-2 hover:text-white text-gray-400 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => dispatch(removeItem(item._id))}
                                                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Footer */}
                        <div className="border-t border-[#2d2d2d] bg-[#1d1d1d] p-6 space-y-4">
                            <div className="flex justify-between text-base font-medium text-gray-100">
                                <p>Estimated total</p>
                                <p className="text-[#d4c5a9]">GHS {totalPrice.toFixed(2)}</p>
                            </div>
                            <p className="text-xs text-center text-gray-500">
                                Taxes, discounts and shipping calculated at checkout.
                            </p>
                            <Link to="/checkout" onClick={() => setIsOpen(false)}>
                                <Button className="w-full bg-[#4A6741] hover:bg-[#3a5232] text-white h-12 text-lg shadow-lg hover:shadow-[#4A6741]/20 transition-all">
                                    Check out
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}

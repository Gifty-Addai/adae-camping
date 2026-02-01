import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/core/store/store';
import { clearCart } from '@/core/store/slice/cart.slice';
import { useOrderAPI, OrderPayload } from '@/hooks/order.hook'; // We just created this
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming these exist
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Page } from '@/components/ui/page';

const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING_RATE = 15;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, totalPrice } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.userSlice);
    const { createOrder, loading } = useOrderAPI();

    const [deliveryMethod, setDeliveryMethod] = useState<'Shipping' | 'Pickup'>('Shipping');
    const [shippingAddress, setShippingAddress] = useState({
        street: user?.streetAddress || '',
        city: user?.city || '',
        zipCode: user?.zipCode || '',
        country: 'Ghana'
    });
    const [pickupLocation, setPickupLocation] = useState('Main Store - Accra');

    // Calculate Fees
    const deliveryFee =
        deliveryMethod === 'Pickup' ? 0 :
            (totalPrice > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE);

    const finalTotal = totalPrice + deliveryFee;

    useEffect(() => {
        if (items.length === 0) {
            navigate('/products');
        }
    }, [items, navigate]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: OrderPayload = {
            products: items.map(item => ({
                product: item._id,
                quantity: item.quantity
            })),
            deliveryMethod,
            shippingAddress: deliveryMethod === 'Shipping' ? shippingAddress : undefined,
            pickupLocation: deliveryMethod === 'Pickup' ? pickupLocation : undefined,
            paymentMethod: 'CashOnDelivery' // Hardcoded for now as per plan
        };

        try {
            await createOrder(payload);
            dispatch(clearCart());
            navigate('/orders');
        } catch (err) {
            // Error handled in hook
        }
    };

    if (!user) {
        return (
            <Page
                pageTitle="Checkout"
                renderBody={() => (
                    <div className="flex flex-col items-center justify-center p-10 text-center h-[60vh]">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to checkout</h2>
                        <Button onClick={() => navigate('/auth')} className="bg-[#4A6741]">
                            Go to Login
                        </Button>
                    </div>
                )}
            />
        );
    }

    return (
        <Page
            pageTitle="Checkout"
            renderBody={() => (
                <div className="container mx-auto p-4 md:p-8 max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8 font-serif text-[#d4c5a9]">Checkout</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Left Column: Form */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="bg-[#2a2a2a] border-[#3d3d3d] shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl text-gray-100">1. Delivery Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        defaultValue="Shipping"
                                        value={deliveryMethod}
                                        onValueChange={(val: string) => setDeliveryMethod(val as 'Shipping' | 'Pickup')}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2 border border-[#3d3d3d] p-4 rounded-lg cursor-pointer hover:bg-[#3d3d3d] w-full transition-all data-[state=checked]:border-[#4A6741] data-[state=checked]:bg-[#4A6741]/10">
                                            <RadioGroupItem value="Shipping" id="r1" className="border-gray-400 text-[#4A6741]" />
                                            <Label htmlFor="r1" className="cursor-pointer w-full font-medium text-gray-200">Ship to Me</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border border-[#3d3d3d] p-4 rounded-lg cursor-pointer hover:bg-[#3d3d3d] w-full transition-all data-[state=checked]:border-[#4A6741] data-[state=checked]:bg-[#4A6741]/10">
                                            <RadioGroupItem value="Pickup" id="r2" className="border-gray-400 text-[#4A6741]" />
                                            <Label htmlFor="r2" className="cursor-pointer w-full font-medium text-gray-200">Store Pickup</Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#2a2a2a] border-[#3d3d3d] shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl text-gray-100">
                                        {deliveryMethod === 'Shipping' ? '2. Shipping Address' : '2. Pickup Location'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {deliveryMethod === 'Shipping' ? (
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="street" className="text-gray-300">Street Address</Label>
                                                <Input
                                                    id="street"
                                                    name="street"
                                                    value={shippingAddress.street}
                                                    onChange={handleAddressChange}
                                                    required
                                                    className="bg-[#1d1d1d] border-[#3d3d3d] focus:ring-[#4A6741] text-gray-100 placeholder:text-gray-500"
                                                    placeholder="123 Main St"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="city" className="text-gray-300">City</Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={shippingAddress.city}
                                                        onChange={handleAddressChange}
                                                        required
                                                        className="bg-[#1d1d1d] border-[#3d3d3d] focus:ring-[#4A6741] text-gray-100"
                                                        placeholder="Accra"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="zipCode" className="text-gray-300">Zip Code</Label>
                                                    <Input
                                                        id="zipCode"
                                                        name="zipCode"
                                                        value={shippingAddress.zipCode}
                                                        onChange={handleAddressChange}
                                                        required
                                                        className="bg-[#1d1d1d] border-[#3d3d3d] focus:ring-[#4A6741] text-gray-100"
                                                        placeholder="00233"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            <Label className="text-gray-300">Select Store</Label>
                                            <Select value={pickupLocation} onValueChange={setPickupLocation}>
                                                <SelectTrigger className="w-full bg-[#1d1d1d] border-[#3d3d3d] text-gray-100">
                                                    <SelectValue placeholder="Select a store" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#2a2a2a] border-[#3d3d3d] text-gray-100">
                                                    <SelectItem value="Main Store - Accra" className="focus:bg-[#3d3d3d] cursor-pointer">Main Store - Accra (Osu)</SelectItem>
                                                    <SelectItem value="Warehouse - Kumasi" className="focus:bg-[#3d3d3d] cursor-pointer">Warehouse - Kumasi</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-gray-400 mt-2">
                                                Your order will be ready for pickup within 24 hours. We will email you when it's ready.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-[#2a2a2a] border-[#3d3d3d] shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl text-gray-100">3. Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border border-[#4A6741]/30 p-4 rounded-lg bg-[#4A6741]/10">
                                        <p className="font-medium text-[#4A6741]">Cash on Delivery / Pay on Pickup</p>
                                        <p className="text-sm text-gray-400">Pay securely when you receive your items.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="md:col-span-1">
                            <Card className="sticky top-24 bg-[#2a2a2a] shadow-xl border border-[#3d3d3d]">
                                <CardHeader className="bg-[#1d1d1d] text-gray-100 rounded-t-lg border-b border-[#3d3d3d]">
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Subtotal ({items.length} items)</span>
                                        <span className="font-medium text-gray-200">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Delivery Fee</span>
                                        <span className={`font-medium ${deliveryFee === 0 ? 'text-[#4A6741]' : 'text-gray-200'}`}>
                                            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                                        </span>
                                    </div>

                                    {deliveryMethod === 'Shipping' && totalPrice < FREE_SHIPPING_THRESHOLD && (
                                        <p className="text-xs text-amber-500 bg-amber-950/30 border border-amber-900/50 p-2 rounded">
                                            Add ${(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(2)} more for free shipping!
                                        </p>
                                    )}

                                    <div className="border-t border-[#3d3d3d] pt-4 mt-4">
                                        <div className="flex justify-between text-lg font-bold text-[#d4c5a9]">
                                            <span>Total</span>
                                            <span>${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading || (deliveryMethod === 'Shipping' && !shippingAddress.street)}
                                        className="w-full bg-[#4A6741] hover:bg-[#3a5232] text-white h-12 text-lg mt-6 shadow-lg hover:shadow-[#4A6741]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : 'Place Order'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};

export default CheckoutPage;

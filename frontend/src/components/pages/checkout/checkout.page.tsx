import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/core/store/store';
import { clearCart } from '@/core/store/slice/cart.slice';
import { useOrderAPI, OrderPayload } from '@/hooks/order.hook';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING_RATE = 15;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, totalPrice } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.userSlice);
    const { createOrder, loading } = useOrderAPI();

    const [deliveryMethod] = useState<'Shipping' | 'Pickup'>('Shipping');
    const [email, setEmail] = useState('');
    const [contactChecked, setContactChecked] = useState(true);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        address: user?.streetAddress || '',
        apartment: '',
        city: user?.city || '',
        postalCode: user?.zipCode || '',
        phone: '',
        country: 'Ghana'
    });
    const [pickupLocation] = useState('Main Store - Accra');
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    // Calculate Fees
    const deliveryFee =
        deliveryMethod === 'Pickup' ? 0 :
            (totalPrice > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE);

    const finalTotal = totalPrice + deliveryFee;

    useEffect(() => {
        if (items.length === 0 && !showSuccessModal) {
            navigate('/products');
        }
    }, [items, navigate, showSuccessModal]);

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
            shippingAddress: deliveryMethod === 'Shipping' ? {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                phone: shippingAddress.phone,
                street: shippingAddress.address,
                city: shippingAddress.city,
                zipCode: shippingAddress.postalCode,
                country: shippingAddress.country,
                landmark: shippingAddress.apartment
            } : undefined,
            pickupLocation: deliveryMethod === 'Pickup' ? pickupLocation : undefined,
            paymentMethod: 'CashOnDelivery'
        };

        try {
            const response: any = await createOrder(payload);
            // Assuming createOrder returns the full response object based on previous edits
            // or we might need to adjust the hook return type. 
            // The backend returns { ... , data: newOrder }. 
            // Our useOrderAPI probably returns response.data or similar.
            // Let's safe check.
            if (response && response.orderId) {
                setOrderId(response.orderId);
            } else if (response && response.data && response.data.orderId) {
                setOrderId(response.data.orderId);
            }
            setShowSuccessModal(true);
            dispatch(clearCart());
            // Navigate is now handled by modal close
        } catch (err) {
            // Error handled in hook
        }
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row min-h-screen bg-white">
            {/* Left Column: Form Section */}
            <div className="flex-1 p-6 lg:p-12 lg:pr-24 overflow-y-auto">
                <div className="max-w-xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Contact Section */}
                        <section>
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold text-gray-800">Contact</h2>
                                {!user && <span className="text-sm text-[#4A6741] cursor-pointer hover:text-[#5a7a50]">Log in</span>}
                            </div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-[#4A6741] focus:border-[#4A6741]"
                            />
                            <div className="flex items-center space-x-2 mt-3">
                                <input
                                    type="checkbox"
                                    id="news"
                                    checked={contactChecked}
                                    onChange={(e) => setContactChecked(e.target.checked)}
                                    className="rounded border-gray-300 text-[#4A6741] focus:ring-[#4A6741]"
                                />
                                <label htmlFor="news" className="text-sm text-gray-600">Email me with news and offers</label>
                            </div>
                        </section>

                        {/* Delivery Section */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Delivery</h2>
                            <div className="space-y-3">
                                <Select defaultValue="Ghana">
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Country/Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ghana">Ghana</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        name="firstName"
                                        placeholder="First name (optional)"
                                        value={shippingAddress.firstName}
                                        onChange={handleAddressChange}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                    <Input
                                        name="lastName"
                                        placeholder="Last name"
                                        value={shippingAddress.lastName}
                                        onChange={handleAddressChange}
                                        required
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>
                                <Input
                                    name="address"
                                    placeholder="Address"
                                    value={shippingAddress.address}
                                    onChange={handleAddressChange}
                                    required
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                                <Input
                                    name="apartment"
                                    placeholder="Nearest Landmark (e.g. Opposite Shell Filling Station)"
                                    value={shippingAddress.apartment}
                                    onChange={handleAddressChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Select
                                        name="region"
                                        value={shippingAddress.city}
                                        onValueChange={(val) => setShippingAddress(prev => ({ ...prev, city: val }))}
                                    >
                                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Select Region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                                            <SelectItem value="Ashanti">Ashanti</SelectItem>
                                            <SelectItem value="Central">Central</SelectItem>
                                            <SelectItem value="Eastern">Eastern</SelectItem>
                                            <SelectItem value="Western">Western</SelectItem>
                                            <SelectItem value="Volta">Volta</SelectItem>
                                            <SelectItem value="Northern">Northern</SelectItem>
                                            <SelectItem value="Upper East">Upper East</SelectItem>
                                            <SelectItem value="Upper West">Upper West</SelectItem>
                                            <SelectItem value="Bono">Bono</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        name="postalCode"
                                        placeholder="Digital Address (GPS)"
                                        value={shippingAddress.postalCode}
                                        onChange={handleAddressChange}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        name="phone"
                                        placeholder="Phone"
                                        value={shippingAddress.phone}
                                        onChange={handleAddressChange}
                                        required
                                        className="bg-white border-gray-300 text-gray-900 pr-10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">?</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="save-info" className="rounded border-gray-300 text-[#4A6741] focus:ring-[#4A6741]" />
                                    <label htmlFor="save-info" className="text-sm text-gray-600">Save this information for next time</label>
                                </div>
                            </div>
                        </section>

                        {/* Shipping Method */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Shipping method</h2>
                            <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <span className="text-sm text-gray-700">Standard Shipping</span>
                                <span className="text-sm font-medium text-gray-900">GHS {deliveryFee.toFixed(2)}</span>
                            </div>
                        </section>

                        {/* Payment */}
                        <section>
                            <div className="mb-3">
                                <h2 className="text-lg font-semibold text-gray-800">Payment</h2>
                                <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>
                            </div>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-[#f0f9eb] border-b border-gray-200 p-4 flex justify-between items-center">
                                    <span className="text-sm font-medium text-[#1a5e1a]">Cash on Delivery</span>
                                    {/* Icons could go here */}
                                </div>
                                <div className="p-8 bg-gray-50 text-center">
                                    <Lock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">You'll pay when your order arrives or at pickup.</p>
                                </div>
                            </div>
                        </section>

                        {/* Billing Address */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Billing address</h2>
                            <RadioGroup value={billingSameAsShipping ? 'same' : 'different'} onValueChange={(v) => setBillingSameAsShipping(v === 'same')}>
                                <div className={`border rounded-lg overflow-hidden ${billingSameAsShipping ? 'border-[#4A6741] bg-[#f0f9eb]' : 'border-gray-200'}`}>
                                    <div className="flex items-center p-4 space-x-2">
                                        <RadioGroupItem value="same" id="billing-same" className="text-[#4A6741]" />
                                        <Label htmlFor="billing-same" className="cursor-pointer font-medium text-gray-700">Same as shipping address</Label>
                                    </div>
                                </div>
                                <div className={`border rounded-lg overflow-hidden mt-3 ${!billingSameAsShipping ? 'border-[#4A6741] bg-[#f0f9eb]' : 'border-gray-200'}`}>
                                    <div className="flex items-center p-4 space-x-2">
                                        <RadioGroupItem value="different" id="billing-diff" className="text-[#4A6741]" />
                                        <Label htmlFor="billing-diff" className="cursor-pointer font-medium text-gray-700">Use a different billing address</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </section>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#89CFF0] hover:bg-[#7ABFE0] text-gray-900 font-semibold h-14 text-lg mt-6 shadow-sm rounded-md transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Order now'}
                        </Button>

                        <div className="text-xs text-center space-x-4 text-gray-500 mt-8 pt-6 border-t border-gray-200">
                            <a href="#" className="underline">Refund policy</a>
                            <a href="#" className="underline">Shipping</a>
                            <a href="#" className="underline">Privacy policy</a>
                            <a href="#" className="underline">Terms of service</a>
                            <a href="#" className="underline">Contact</a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Column: Order Summary (Dark Theme) */}
            <div className="w-full lg:w-[45%] bg-[#1a1a1a] border-b lg:border-b-0 lg:border-l border-[#2d2d2d] p-6 lg:p-12 text-gray-300">
                <div className="max-w-md sticky top-12 space-y-6">
                    {/* Items List */}
                    <div className="space-y-4 max-h-64 lg:max-h-full overflow-y-auto">
                        {items.map((item) => (
                            <div key={item._id} className="flex gap-4 items-center">
                                <div className="relative">
                                    <div className="h-16 w-16 bg-[#2a2a2a] rounded-lg border border-[#3d3d3d] overflow-hidden relative">
                                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 bg-[#4d4d4d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-gray-100 font-medium">{item.name}</h3>
                                    {/* <p className="text-sm text-gray-400">Variant info here</p> */}
                                </div>
                                <span className="font-medium text-gray-200">GHS {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[#2d2d2d] my-6"></div>

                    {/* Discount Code */}
                    <div className="flex gap-3">
                        <Input
                            placeholder="Discount code"
                            className="bg-[#2a2a2a] border-[#3d3d3d] text-white placeholder:text-gray-500 focus:ring-[#4A6741]"
                        />
                        <Button variant="outline" className="border-[#3d3d3d] bg-[#2a2a2a] text-gray-300 hover:bg-[#3d3d3d] hover:text-white">
                            Apply
                        </Button>
                    </div>

                    <div className="border-t border-[#2d2d2d] my-6"></div>

                    {/* Totals */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Subtotal • {items.length} items</span>
                            <span className="text-gray-200 font-medium">GHS {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Shipping</span>
                            <span className="text-gray-200 font-medium">GHS {deliveryFee.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t border-[#2d2d2d] my-6 pt-6">
                        <div className="flex justify-between items-baseline">
                            <span className="text-lg font-medium text-gray-100">Total</span>
                            <div className="text-right">
                                <span className="text-sm text-gray-400 mr-2">GHS</span>
                                <span className="text-3xl font-bold text-[#d4c5a9]">{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Success Modal */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto bg-green-100 p-3 rounded-full mb-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Order Placed Successfully!</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Thank you for your purchase. Your order ID is <span className="font-bold text-gray-900">{orderId}</span>.
                            We have received your order and are processing it.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center mt-4">
                        <Button
                            className="bg-[#4A6741] hover:bg-[#3a5232] w-full sm:w-auto text-white"
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate('/products');
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CheckoutPage;


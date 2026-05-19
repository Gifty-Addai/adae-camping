import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderAPI } from '@/hooks/order.hook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loader/_spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Page } from '@/components/ui/page';
import { ArrowLeft, MapPin, Phone, Mail, User, Package, CreditCard, Truck } from 'lucide-react';

const OrderDetailsDash: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getOrderById, loading } = useOrderAPI();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (id) {
                const data: any = await getOrderById(id);
                if (data) {
                    // Check if data is nested in data property or direct
                    setOrder(data.data || data);
                }
            }
        };
        fetchOrder();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500 hover:bg-green-600';
            case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Cancelled': return 'bg-red-500 hover:bg-red-600';
            case 'Processing': return 'bg-blue-500 hover:bg-blue-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-[#2a2a2a]"><Spinner size="xl" /></div>;
    }

    if (!order) {
        return (
            <Page
                pageTitle="Order Details"
                renderBody={() => (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                        <p>Order not found</p>
                        <Button variant="link" onClick={() => navigate('/admin/orders')} className="text-[#8b7355]">
                            Back to Orders
                        </Button>
                    </div>
                )}
            />
        );
    }

    return (
        <Page
            pageTitle={`Order ${order.orderId || order._id}`}
            renderBody={() => (
                <div className="bg-[#2a2a2a] min-h-screen text-gray-100 p-6 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3d3d3d] pb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/orders')} className="text-gray-400 hover:text-white hover:bg-[#3d3d3d]">
                                    <ArrowLeft size={20} />
                                </Button>
                                <h1 className="text-2xl font-bold">Order Details</h1>
                            </div>
                            <div className="flex items-center gap-3 ml-10">
                                <span className="text-xl text-[#d4c5a9] font-mono">{order.orderId || `#${order._id}`}</span>
                                <Badge className={`${getStatusColor(order.status)} text-white border-0`}>{order.status}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Placed on {format(new Date(order.createdAt), 'PPpp')}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Order Items & Payment */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Products */}
                            <Card className="bg-[#2a2a2a] border border-[#3d3d3d]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-100">
                                        <Package size={20} className="text-[#8b7355]" />
                                        Order Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {order.products.map((item: any, index: number) => (
                                            <div key={index} className="flex gap-4 py-4 border-b border-[#3d3d3d] last:border-0 items-center">
                                                <div className="w-16 h-16 bg-[#353535] rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product?.imageUrl && (
                                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-200">{item.product?.name || 'Unknown Product'}</h3>
                                                    <p className="text-sm text-gray-400">Qty: {item.quantity} x GHS {item.price}</p>
                                                </div>
                                                <div className="text-right font-medium text-[#d4c5a9]">
                                                    GHS {(item.quantity * item.price).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-[#3d3d3d] space-y-2">
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>Subtotal</span>
                                            <span>GHS {(order.totalAmount - (order.deliveryFee || 0)).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>Delivery Fee</span>
                                            <span>GHS {(order.deliveryFee || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-gray-100 pt-2">
                                            <span>Total</span>
                                            <span className="text-[#d4c5a9]">GHS {order.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Info */}
                            <Card className="bg-[#2a2a2a] border border-[#3d3d3d]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-100">
                                        <CreditCard size={20} className="text-[#8b7355]" />
                                        Payment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase">Payment Method</span>
                                            <p className="text-gray-200 font-medium">{order.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase">Payment Status</span>
                                            <div>
                                                <Badge variant="outline" className={`mt-1 border-0 ${order.paymentStatus === 'Paid' ? 'text-green-400 bg-green-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                                                    {order.paymentStatus}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Customer & Delivery */}
                        <div className="space-y-6">
                            {/* Customer Details */}
                            <Card className="bg-[#2a2a2a] border border-[#3d3d3d]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-100">
                                        <User size={20} className="text-[#8b7355]" />
                                        Customer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#353535] flex items-center justify-center text-[#8b7355] font-bold">
                                            {(order.user?.name || "G")[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-200">{order.user?.name || "Guest User"}</p>
                                            <p className="text-xs text-gray-400">Customer</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-[#3d3d3d] space-y-3">
                                        <div className="flex gap-3 text-sm text-gray-300">
                                            <Mail size={16} className="text-gray-500 mt-0.5" />
                                            <span>{order.user?.email || "N/A"}</span>
                                        </div>
                                        <div className="flex gap-3 text-sm text-gray-300">
                                            <Phone size={16} className="text-gray-500 mt-0.5" />
                                            <span>{order.shippingAddress?.phone || order.user?.phone || "N/A"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Delivery Information */}
                            <Card className="bg-[#2a2a2a] border border-[#3d3d3d]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-100">
                                        <Truck size={20} className="text-[#8b7355]" />
                                        Delivery Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase">Method</span>
                                        <p className="text-gray-200 font-medium">{order.deliveryMethod}</p>
                                    </div>

                                    {order.deliveryMethod === 'Shipping' && order.shippingAddress && (
                                        <div className="pt-2">
                                            <span className="text-xs text-gray-500 uppercase block mb-1">Shipping Address</span>
                                            <div className="flex gap-2 text-sm text-gray-300">
                                                <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                                                <p className="leading-relaxed">
                                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                                                    {order.shippingAddress.street}<br />
                                                    {order.shippingAddress.city}, {order.shippingAddress.zipCode}<br />
                                                    {order.shippingAddress.country}
                                                    {order.shippingAddress.landmark && <span className="block text-gray-500 mt-1 italic">Note: {order.shippingAddress.landmark}</span>}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {order.deliveryMethod === 'Pickup' && (
                                        <div className="pt-2">
                                            <span className="text-xs text-gray-500 uppercase block mb-1">Pickup Location</span>
                                            <p className="text-gray-200 font-medium">{order.pickupLocation}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};

export default OrderDetailsDash;

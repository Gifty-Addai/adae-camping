import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderAPI } from '@/hooks/order.hook';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loader/_spinner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Page } from '@/components/ui/page';

interface Order {
    _id: string;
    orderId: string;
    user: {
        name: string;
        email: string;
    };
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    products: any[];
}

const OrdersDash: React.FC = () => {
    const navigate = useNavigate();
    const { getAllOrders, loading } = useOrderAPI();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const data: any = await getAllOrders();
            if (data && data.orders) {
                setOrders(data.orders);
            } else if (Array.isArray(data)) {
                setOrders(data);
            }
        };
        fetchOrders();
    }, []);

    const handleRowClick = (orderId: string) => {
        navigate(`/admin/orders/${orderId}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500 hover:bg-green-600';
            case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Cancelled': return 'bg-red-500 hover:bg-red-600';
            case 'Processing': return 'bg-blue-500 hover:bg-blue-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    if (loading && orders.length === 0) {
        return <div className="flex justify-center items-center h-full"><Spinner size="xl" /></div>;
    }

    return (
        <Page
            pageTitle="Orders Management"
            renderBody={() => (
                <div className="bg-[#2a2a2a] min-h-screen rounded-lg p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-100">All Orders</h1>
                        <Badge variant="outline" className="text-lg py-1 px-4 text-gray-300 border-gray-600">{orders.length} Total</Badge>
                    </div>

                    <Card className="bg-[#2a2a2a] border border-[#3d3d3d] shadow-sm text-gray-100">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-400">
                                    <thead className="text-xs text-gray-400 uppercase bg-[#353535]">
                                        <tr>
                                            <th className="px-6 py-4 rounded-tl-lg">Order ID</th>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Payment</th>
                                            <th className="px-6 py-4 text-right rounded-tr-lg">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#3d3d3d]">
                                        {orders.map((order) => (
                                            <tr
                                                key={order._id}
                                                className="bg-[#2a2a2a] hover:bg-[#353535] transition-colors cursor-pointer"
                                                onClick={() => handleRowClick(order._id)}
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-200 whitespace-nowrap">
                                                    {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-200">{order.user?.name || 'Guest'}</div>
                                                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-orange-400'}`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-[#d4c5a9]">
                                                    GHS {order.totalAmount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                    No orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        />
    );
};

export default OrdersDash;

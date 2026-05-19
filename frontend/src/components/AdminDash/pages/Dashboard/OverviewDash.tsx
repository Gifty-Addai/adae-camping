import React, { useEffect, useState } from 'react';
import { useAdminAPI, DashboardStats } from '@/hooks/admin.hook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { Spinner } from '@/components/ui/loader/_spinner';
import { Page } from '@/components/ui/page';
import StatisticsCard from '../../AdComponents/booking-statistics-card';

const OverviewDash: React.FC = () => {
    const { getDashboardStats, loading } = useAdminAPI();
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            if (data) setStats(data);
        };
        fetchStats();
    }, []);

    // Helper to calculate percentage logic if needed, currently hardcoded in original
    // For now we will keep static mock growth numbers as in original design, or remove if preferred.
    // Preserving original mock data for visual consistency with user's initial code.

    return (
        <Page
            pageTitle="Dashboard Overview"
            renderBody={() => (
                <div className="bg-[#2a2a2a] min-h-screen rounded-lg p-6">
                    {/* Key Metrics Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatisticsCard
                            title="Total Sales"
                            value={`GHS ${stats?.totalSales.toLocaleString() || '0.00'}`}
                            icon={<DollarSign className="w-5 h-5 text-white" />}
                            color="bg-[#4A6741]"
                        />
                        <StatisticsCard
                            title="Orders"
                            value={`+${stats?.totalOrders || 0}`}
                            icon={<ShoppingBag className="w-5 h-5 text-white" />}
                            color="bg-[#8b7355]"
                        />
                        <StatisticsCard
                            title="Products"
                            value={`+${stats?.totalProducts || 0}`}
                            icon={<Package className="w-5 h-5 text-white" />}
                            color="bg-indigo-600"
                        />
                        <StatisticsCard
                            title="Active Customers"
                            value={`+${stats?.totalCustomers || 0}`}
                            icon={<Users className="w-5 h-5 text-white" />}
                            color="bg-orange-500"
                        />
                    </div>

                    {loading && !stats ? (
                        <div className="flex justify-center items-center h-64"><Spinner size="xl" /></div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                            {/* Sales by Region */}
                            <Card className="col-span-4 bg-[#2a2a2a] border border-[#3d3d3d] shadow-sm text-gray-100">
                                <CardHeader>
                                    <CardTitle className="text-gray-100">Sales by Region</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="space-y-4">
                                        {stats?.salesByRegion.map((region) => (
                                            <div key={region._id} className="flex items-center p-2 rounded-lg hover:bg-[#353535] transition-colors">
                                                <div className="ml-4 space-y-1 flex-1">
                                                    <p className="text-sm font-medium leading-none text-gray-200">{region._id || 'Unknown Region'}</p>
                                                    <p className="text-xs text-gray-400">{region.count} orders</p>
                                                </div>
                                                <div className="font-medium text-[#d4c5a9]">GHS {region.total.toLocaleString()}</div>
                                            </div>
                                        ))}
                                        {(!stats?.salesByRegion || stats.salesByRegion.length === 0) && (
                                            <p className="text-center text-gray-500 py-4">No shipping data available yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Orders */}
                            <Card className="col-span-3 bg-[#2a2a2a] border border-[#3d3d3d] shadow-sm text-gray-100">
                                <CardHeader>
                                    <CardTitle className="text-gray-100">Recent Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {stats?.recentOrders.map((order) => (
                                            <div key={order._id} className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none text-gray-200">{order.user?.name || "Guest"}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {order.products.length} items - {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium text-[#d4c5a9]">+GHS {order.totalAmount.toLocaleString()}</div>
                                            </div>
                                        ))}
                                        {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                                            <p className="text-center text-gray-500 py-4">No orders yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        />
    );
};

export default OverviewDash;

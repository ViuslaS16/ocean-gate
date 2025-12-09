'use client';

import { useEffect, useState } from 'react';
import { Package, DollarSign, AlertTriangle, Box } from 'lucide-react';
import MetricCard from '@/components/Dashboard/MetricCard';
import StockChart from '@/components/Dashboard/StockChart';
import CategoryChart from '@/components/Dashboard/CategoryChart';
import ActivityTable from '@/components/Dashboard/ActivityTable';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getDashboardMetrics } from '@/lib/api';
import { formatCurrency, formatWeight } from '@/lib/utils';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await getDashboardMetrics();
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Stock"
                        value={`${metrics?.metrics?.totalStock?.quantity || 0} pcs`}
                        subtitle={formatWeight(metrics?.metrics?.totalStock?.weight || 0)}
                        icon={Package}
                        color="ocean"
                    />
                    <MetricCard
                        title="This Week's Income"
                        value={formatCurrency(metrics?.metrics?.thisWeekIncome || 0)}
                        subtitle="Finalized invoices only"
                        icon={DollarSign}
                        color="green"
                    />
                    <MetricCard
                        title="Total DOA Weight"
                        value={formatWeight(metrics?.metrics?.totalDOAWeight || 0)}
                        icon={AlertTriangle}
                        color="red"
                    />
                    <MetricCard
                        title="Available Boxes"
                        value={metrics?.metrics?.availableBoxes || 0}
                        subtitle="In stock"
                        icon={Box}
                        color="blue"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StockChart data={metrics?.weeklyMovement || []} />
                    <CategoryChart data={metrics?.categoryDistribution || []} />
                </div>

                {/* Activity Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ActivityTable
                        title="Recent Stock Additions"
                        data={metrics?.recentStock || []}
                        type="stock"
                    />
                    <ActivityTable
                        title="Recent Invoices"
                        data={metrics?.recentInvoices || []}
                        type="invoice"
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}

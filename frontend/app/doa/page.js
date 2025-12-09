'use client';

import { useEffect, useState } from 'react';
import DOAForm from '@/components/DOA/DOAForm';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Toast from '@/components/UI/Toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getAvailableStock, getDOARecords, recordDOA } from '@/lib/api';
import { formatWeight, formatDateTime } from '@/lib/utils';

export default function DOAPage() {
    const [availableStock, setAvailableStock] = useState([]);
    const [doaRecords, setDoaRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [stockResponse, doaResponse] = await Promise.all([
                getAvailableStock(),
                getDOARecords()
            ]);
            setAvailableStock(stockResponse.data);
            setDoaRecords(doaResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setToast({ type: 'error', message: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const handleRecordDOA = async (data) => {
        try {
            await recordDOA(data);
            setToast({ type: 'success', message: 'DOA recorded successfully' });
            fetchData();
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Failed to record DOA' });
        }
    };

    return (
        <ProtectedRoute>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">DOA Management</h1>

                <DOAForm
                    stock={availableStock}
                    onSubmit={handleRecordDOA}
                />

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">DOA Records</h3>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DOA Quantity</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DOA Weight</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Notes</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Recorded At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doaRecords && doaRecords.length > 0 ? (
                                        doaRecords.map((record) => (
                                            <tr key={record._id} className="border-t border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm">{record.stock?.category?.name || 'N/A'}</td>
                                                <td className="py-3 px-4 text-sm">{record.quantity}</td>
                                                <td className="py-3 px-4 text-sm">{formatWeight(record.weight)}</td>
                                                <td className="py-3 px-4 text-sm">{record.notes || '-'}</td>
                                                <td className="py-3 px-4 text-sm">{formatDateTime(record.recordedAt)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-400">
                                                No DOA records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}

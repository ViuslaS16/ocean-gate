'use client';

import { formatDateTime, formatWeight, formatCurrency } from '@/lib/utils';

const ActivityTable = ({ title, data, type }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            {type === 'stock' ? (
                                <>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Box ID</th>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Category</th>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Quantity</th>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Weight</th>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Date</th>
                                </>
                            ) : (
                                <>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Invoice #</th>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Customer</th>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Total</th>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Status</th>
                                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Date</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    {type === 'stock' ? (
                                        <>
                                            <td className="py-2 px-3 text-sm">{item.boxId}</td>
                                            <td className="py-2 px-3 text-sm">{item.category?.name || 'N/A'}</td>
                                            <td className="py-2 px-3 text-sm">{item.quantity}</td>
                                            <td className="py-2 px-3 text-sm">{formatWeight(item.weight)}</td>
                                            <td className="py-2 px-3 text-sm">{formatDateTime(item.createdAt)}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-2 px-3 text-sm font-medium">{item.invoiceNumber}</td>
                                            <td className="py-2 px-3 text-sm">{item.customer?.name || 'N/A'}</td>
                                            <td className="py-2 px-3 text-sm">{formatCurrency(item.total)}</td>
                                            <td className="py-2 px-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Finalized'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 text-sm">{formatDateTime(item.createdAt)}</td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-400">
                                    No recent activity
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityTable;

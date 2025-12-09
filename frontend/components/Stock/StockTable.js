'use client';

import { Trash2 } from 'lucide-react';
import { formatCurrency, formatWeight } from '@/lib/utils';

const StockTable = ({ stock, onDelete }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Available':
                return 'bg-green-100 text-green-800';
            case 'Sold':
                return 'bg-blue-100 text-blue-800';
            case 'DOA':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Quantity</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Weight</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Unit Price</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stock && stock.length > 0 ? (
                            stock.map((item) => (
                                <tr key={item._id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm">{item.category?.name || 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm">{item.quantity}</td>
                                    <td className="py-3 px-4 text-sm">{formatWeight(item.weight)}</td>
                                    <td className="py-3 px-4 text-sm">{formatCurrency(item.unitPrice)}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">{item.location || '-'}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-400">
                                    No stock items found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockTable;

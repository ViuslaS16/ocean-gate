'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Download } from 'lucide-react';
import { getInvoices } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Toast from '@/components/UI/Toast';
import { generateInvoicePDF } from '@/lib/pdfGenerator';

export default function InvoicesPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await getInvoices();
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setToast({ type: 'error', message: 'Failed to load invoices' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        return status === 'Finalized'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800';
    };

    const handleDownloadPDF = (invoice) => {
        try {
            generateInvoicePDF(invoice, invoice.invoiceNumber);
            setToast({ type: 'success', message: 'PDF downloaded successfully' });
        } catch (error) {
            console.error('Error generating PDF:', error);
            setToast({ type: 'error', message: 'Failed to generate PDF' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                <button
                    onClick={() => router.push('/invoices/new')}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>New Invoice</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice #</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Code</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Created</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices && invoices.length > 0 ? (
                                    invoices.map((invoice) => (
                                        <tr key={invoice._id} className="border-t border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-ocean-600">
                                                {invoice.invoiceNumber}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {new Date(invoice.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 text-sm">{invoice.customer?.name || 'N/A'}</td>
                                            <td className="py-3 px-4 text-sm">{invoice.shipping?.code || invoice.shipping?.destination || 'N/A'}</td>
                                            <td className="py-3 px-4 text-sm font-medium">{formatCurrency(invoice.total)}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm">{formatDateTime(invoice.createdAt)}</td>
                                            <td className="py-3 px-4 text-sm">
                                                {invoice.status === 'Finalized' && (
                                                    <button
                                                        onClick={() => handleDownloadPDF(invoice)}
                                                        className="text-ocean-600 hover:text-ocean-800 flex items-center space-x-1"
                                                        title="Download PDF"
                                                    >
                                                        <Download size={18} />
                                                        <span className="text-xs">PDF</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-400">
                                            <FileText size={48} className="mx-auto mb-3 opacity-50" />
                                            <p>No invoices found</p>
                                            <button
                                                onClick={() => router.push('/invoices/new')}
                                                className="btn-primary mt-4"
                                            >
                                                Create First Invoice
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

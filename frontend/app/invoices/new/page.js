'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { getAvailableStock, createInvoice, finalizeInvoice } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Toast from '@/components/UI/Toast';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { generateInvoicePDF } from '@/lib/pdfGenerator';

export default function NewInvoicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [availableStock, setAvailableStock] = useState([]);
    const [toast, setToast] = useState(null);

    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: '',
        date: new Date().toISOString().split('T')[0],
        customer: { name: '', address: '', phone: '', email: '' },
        shipping: { awbNumber: '', flightNumber: '', code: '100', hcNumber: '', parkingCenter: 'Isabela Sea Foods' },
        lineItems: [],
    });

    useEffect(() => {
        fetchAvailableStock();
    }, []);

    const fetchAvailableStock = async () => {
        try {
            const response = await getAvailableStock();
            setAvailableStock(response.data);
        } catch (error) {
            console.error('Error fetching stock:', error);
        }
    };

    const addLineItem = () => {
        setInvoiceData({
            ...invoiceData,
            lineItems: [
                ...invoiceData.lineItems,
                { stockId: '', description: '', quantity: 1, unitPrice: 0 }
            ]
        });
    };

    const removeLineItem = (index) => {
        const newLineItems = invoiceData.lineItems.filter((_, i) => i !== index);
        setInvoiceData({ ...invoiceData, lineItems: newLineItems });
    };

    const updateLineItem = (index, field, value) => {
        const newLineItems = [...invoiceData.lineItems];
        newLineItems[index][field] = value;

        // Auto-fill when stock is selected
        if (field === 'stockId' && value) {
            const stock = availableStock.find(s => s._id === value);
            if (stock) {
                newLineItems[index].description = stock.category?.name || 'Unknown';
                newLineItems[index].unitPrice = stock.unitPrice;
                newLineItems[index].quantity = Math.min(1, stock.quantity);
            }
        }

        setInvoiceData({ ...invoiceData, lineItems: newLineItems });
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalWeight = 0;

        invoiceData.lineItems.forEach(item => {
            const itemSubtotal = item.quantity * item.unitPrice;
            subtotal += itemSubtotal;

            const stock = availableStock.find(s => s._id === item.stockId);
            if (stock) {
                totalWeight += (stock.weight / stock.quantity) * item.quantity;
            }
        });

        const total = subtotal; // No tax

        return { subtotal, tax: 0, total, totalWeight };
    };

    const handleSaveDraft = async () => {
        if (!validateInvoice()) return;

        try {
            setLoading(true);
            const totals = calculateTotals();

            const payload = {
                ...invoiceData,
                ...totals,
                lineItems: invoiceData.lineItems.map(item => ({
                    ...item,
                    subtotal: item.quantity * item.unitPrice
                }))
            };

            await createInvoice(payload);
            setToast({ type: 'success', message: 'Invoice saved as draft' });
            setTimeout(() => router.push('/invoices'), 1500);
        } catch (error) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = async () => {
        if (!validateInvoice()) return;

        try {
            setLoading(true);
            const totals = calculateTotals();

            const payload = {
                ...invoiceData,
                ...totals,
                lineItems: invoiceData.lineItems.map(item => {
                    const stock = availableStock.find(s => s._id === item.stockId);
                    const itemWeight = stock ? (stock.weight / stock.quantity) * item.quantity : 0;
                    return {
                        ...item,
                        weight: itemWeight,
                        subtotal: item.quantity * item.unitPrice
                    };
                })
            };

            const createResponse = await createInvoice(payload);
            const invoice = createResponse.data;

            await finalizeInvoice(invoice._id);

            // Generate PDF using utility function with full payload including weights
            generateInvoicePDF(payload, invoiceData.invoiceNumber);

            setToast({ type: 'success', message: 'Invoice finalized and PDF downloaded' });
            setTimeout(() => router.push('/invoices'), 2000);
        } catch (error) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const validateInvoice = () => {
        if (!invoiceData.invoiceNumber || invoiceData.invoiceNumber.trim() === '') {
            setToast({ type: 'error', message: 'Please enter an invoice number' });
            return false;
        }

        if (!invoiceData.customer.name || !invoiceData.customer.address) {
            setToast({ type: 'error', message: 'Please fill in customer name and address' });
            return false;
        }

        if (!invoiceData.shipping.awbNumber || !invoiceData.shipping.flightNumber ||
            !invoiceData.shipping.code || !invoiceData.shipping.hcNumber ||
            !invoiceData.shipping.parkingCenter) {
            setToast({ type: 'error', message: 'Please fill in all shipping details' });
            return false;
        }

        if (invoiceData.lineItems.length === 0) {
            // Allow empty line items for drafts, but warn user
            return true;
        }

        for (const item of invoiceData.lineItems) {
            if (!item.stockId || !item.quantity) {
                setToast({ type: 'error', message: 'Please complete all line items' });
                return false;
            }

            const stock = availableStock.find(s => s._id === item.stockId);
            if (stock && item.quantity > stock.quantity) {
                setToast({ type: 'error', message: `Insufficient quantity for ${stock.boxId}` });
                return false;
            }
        }

        return true;
    };

    const totals = calculateTotals();

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>

            {/* Header Information */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Invoice Number *</label>
                        <input
                            type="text"
                            className="input"
                            value={invoiceData.invoiceNumber}
                            onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                            placeholder="e.g., INV-2025-001"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Date</label>
                        <input
                            type="date"
                            className="input"
                            value={invoiceData.date}
                            onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Customer Information */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Name *</label>
                        <input
                            type="text"
                            className="input"
                            value={invoiceData.customer.name}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                customer: { ...invoiceData.customer, name: e.target.value }
                            })}
                        />
                    </div>
                    <div>
                        <label className="label">Phone</label>
                        <input
                            type="tel"
                            className="input"
                            value={invoiceData.customer.phone}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                customer: { ...invoiceData.customer, phone: e.target.value }
                            })}
                        />
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={invoiceData.customer.email}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                customer: { ...invoiceData.customer, email: e.target.value }
                            })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label">Address *</label>
                        <textarea
                            className="input"
                            rows="2"
                            value={invoiceData.customer.address}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                customer: { ...invoiceData.customer, address: e.target.value }
                            })}
                        />
                    </div>
                </div>
            </div>

            {/* Shipping Information */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="label">AWB Number *</label>
                        <input
                            type="text"
                            className="input"
                            value={invoiceData.shipping.awbNumber}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                shipping: { ...invoiceData.shipping, awbNumber: e.target.value }
                            })}
                        />
                    </div>
                    <div>
                        <label className="label">Flight Number *</label>
                        <input
                            type="text"
                            className="input"
                            value={invoiceData.shipping.flightNumber}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                shipping: { ...invoiceData.shipping, flightNumber: e.target.value }
                            })}
                        />
                    </div>
                    <div>
                        <label className="label">Code *</label>
                        <input
                            type="text"
                            className="input"
                            value={invoiceData.shipping.code}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                shipping: { ...invoiceData.shipping, code: e.target.value }
                            })}
                        />
                    </div>
                    <div>
                        <label className="label">HC Number *</label>
                        <input
                            type="text"
                            className="input"
                            value={invoiceData.shipping.hcNumber}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                shipping: { ...invoiceData.shipping, hcNumber: e.target.value }
                            })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label">Parking Center *</label>
                        <input
                            type="text"
                            className="input"
                            value={invoiceData.shipping.parkingCenter}
                            onChange={(e) => setInvoiceData({
                                ...invoiceData,
                                shipping: { ...invoiceData.shipping, parkingCenter: e.target.value }
                            })}
                            placeholder="Isabela Sea Foods"
                        />
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                    <button onClick={addLineItem} className="btn-primary flex items-center space-x-2">
                        <Plus size={16} />
                        <span>Add Item</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {invoiceData.lineItems.map((item, index) => {
                        const stock = availableStock.find(s => s._id === item.stockId);
                        // Filter out stock items that are already selected in other line items
                        const selectedStockIds = invoiceData.lineItems
                            .filter((_, i) => i !== index)
                            .map(lineItem => lineItem.stockId);
                        const availableForThisLine = availableStock.filter(
                            s => !selectedStockIds.includes(s._id)
                        );

                        return (
                            <div key={index} className="flex gap-2 items-start p-3 border border-gray-200 rounded-lg">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                                    <div>
                                        <label className="label text-xs">Stock Item *</label>
                                        <select
                                            className="input text-sm"
                                            value={item.stockId}
                                            onChange={(e) => updateLineItem(index, 'stockId', e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            {availableForThisLine.map((stock) => (
                                                <option key={stock._id} value={stock._id}>
                                                    {stock.category?.name} ({stock.quantity} pcs)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label text-xs">Quantity *</label>
                                        <input
                                            type="number"
                                            className="input text-sm"
                                            value={item.quantity}
                                            onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                            min="1"
                                            max={stock?.quantity || 999}
                                        />
                                    </div>
                                    <div>
                                        <label className="label text-xs">Weight (kg)</label>
                                        <div className="input text-sm bg-gray-50">
                                            {stock ? ((stock.weight / stock.quantity) * item.quantity).toFixed(2) : '0.00'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label text-xs">Unit Price</label>
                                        <input
                                            type="number"
                                            className="input text-sm"
                                            value={item.unitPrice}
                                            onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                            step="0.01"
                                        />
                                    </div>
                                    <div>
                                        <label className="label text-xs">Subtotal</label>
                                        <div className="input text-sm bg-gray-50">
                                            {formatCurrency(item.quantity * item.unitPrice)}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeLineItem(index)}
                                    className="mt-6 text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Totals */}
            <div className="card bg-gray-50">
                <div className="max-w-md ml-auto space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(totals.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 border-t border-gray-200 pt-2">
                        <span>Total Weight:</span>
                        <span>{totals.totalWeight.toFixed(2)} kg</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
                <button onClick={() => router.push('/invoices')} className="btn-secondary">
                    Cancel
                </button>
                <button onClick={handleSaveDraft} disabled={loading} className="btn-secondary">
                    {loading ? 'Saving...' : 'Save as Draft'}
                </button>
                <button onClick={handleFinalize} disabled={loading} className="btn-primary">
                    {loading ? 'Finalizing...' : 'Finalize & Download PDF'}
                </button>
            </div>

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

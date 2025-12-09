'use client';

import { useState, useEffect } from 'react';

const DOAForm = ({ stock, onSubmit, onSuccess }) => {
    const [selectedStock, setSelectedStock] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [maxQuantity, setMaxQuantity] = useState(0);

    useEffect(() => {
        if (selectedStock) {
            const stockItem = stock.find(s => s._id === selectedStock);
            setMaxQuantity(stockItem ? stockItem.quantity : 0);
        }
    }, [selectedStock, stock]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const stockItem = stock.find(s => s._id === selectedStock);

        if (!stockItem) {
            alert('Please select a stock item');
            return;
        }

        if (!quantity || parseInt(quantity) < 1) {
            alert('Please enter a valid quantity');
            return;
        }

        if (parseInt(quantity) > stockItem.quantity) {
            alert(`Quantity cannot exceed available quantity (${stockItem.quantity})`);
            return;
        }

        await onSubmit({
            stockId: selectedStock,
            quantity: parseInt(quantity),
            notes
        });

        // Reset form
        setSelectedStock('');
        setQuantity('');
        setNotes('');
        setMaxQuantity(0);

        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Record DOA (Dead on Arrival)</h3>

            <div className="space-y-4">
                <div>
                    <label className="label">Select Stock Item <span className="text-red-500">*</span></label>
                    <select
                        className="input"
                        value={selectedStock}
                        onChange={(e) => setSelectedStock(e.target.value)}
                        required
                    >
                        <option value="">Select stock item...</option>
                        {stock && stock.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.category?.name} ({item.quantity} pcs available, {item.weight} kg)
                            </option>
                        ))}
                    </select>
                </div>

                {selectedStock && (
                    <>
                        <div>
                            <label className="label">
                                DOA Quantity <span className="text-red-500">*</span>
                                {maxQuantity > 0 && (
                                    <span className="text-sm text-gray-500 ml-2">(Max: {maxQuantity})</span>
                                )}
                            </label>
                            <input
                                type="number"
                                className="input"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                                min="1"
                                max={maxQuantity}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Notes / Reason</label>
                            <textarea
                                className="input"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Reason for DOA..."
                                rows="3"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="mt-4">
                <button type="submit" className="btn-danger">
                    Record DOA
                </button>
            </div>
        </form>
    );
};

export default DOAForm;

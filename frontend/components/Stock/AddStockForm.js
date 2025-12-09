'use client';

import { useState, useEffect } from 'react';

const AddStockForm = ({ categories, onSubmit, onSuccess }) => {
    const [formData, setFormData] = useState({
        category: '',
        quantity: '',
        weight: '',
        unitPrice: '',
        location: '',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category || !formData.quantity || !formData.weight || !formData.unitPrice) {
            alert('Please fill in all required fields');
            return;
        }

        await onSubmit({
            ...formData,
            quantity: parseInt(formData.quantity),
            weight: parseFloat(formData.weight),
            unitPrice: parseFloat(formData.unitPrice)
        });

        // Reset form
        setFormData({
            category: '',
            quantity: '',
            weight: '',
            unitPrice: '',
            location: '',
            notes: ''
        });

        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Stock</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Category <span className="text-red-500">*</span></label>
                    <select
                        className="input"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label">Quantity <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        className="input"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="10"
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label className="label">Weight (kg) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        step="0.01"
                        className="input"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="2.50"
                        min="0"
                        required
                    />
                </div>

                <div>
                    <label className="label">Unit Price ($) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        step="0.01"
                        className="input"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                        placeholder="50.00"
                        min="0"
                        required
                    />
                </div>

                <div>
                    <label className="label">Location</label>
                    <input
                        type="text"
                        className="input"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Warehouse A"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="label">Notes</label>
                    <textarea
                        className="input"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Additional notes..."
                        rows="2"
                    />
                </div>
            </div>

            <div className="mt-4">
                <button type="submit" className="btn-primary">
                    Add Stock
                </button>
            </div>
        </form>
    );
};

export default AddStockForm;

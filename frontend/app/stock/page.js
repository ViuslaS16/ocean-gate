'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import AddStockForm from '@/components/Stock/AddStockForm';
import StockFilters from '@/components/Stock/StockFilters';
import StockTable from '@/components/Stock/StockTable';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Toast from '@/components/UI/Toast';
import ConfirmDialog from '@/components/UI/ConfirmDialog';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCategories, getStock, createStock, deleteStock } from '@/lib/api';

export default function StockPage() {
    const [categories, setCategories] = useState([]);
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [filters, setFilters] = useState({ search: '', category: 'all', status: 'all', page: 1 });
    const [toast, setToast] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchStock();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchStock = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.category !== 'all') params.category = filters.category;
            if (filters.status !== 'all') params.status = filters.status;
            params.page = filters.page;

            const response = await getStock(params);
            setStock(response.data);
        } catch (error) {
            console.error('Error fetching stock:', error);
            setToast({ type: 'error', message: 'Failed to load stock' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddStock = async (data) => {
        try {
            await createStock(data);
            setToast({ type: 'success', message: 'Stock added successfully' });
            fetchStock();
            setShowAddForm(false);
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Failed to add stock' });
        }
    };

    const handleDeleteStock = async () => {
        try {
            await deleteStock(deleteDialog.item._id);
            setToast({ type: 'success', message: 'Stock deleted successfully' });
            fetchStock();
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Failed to delete stock' });
        }
    };

    return (
        <ProtectedRoute>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Add Stock</span>
                    </button>
                </div>

                {showAddForm && (
                    <AddStockForm
                        categories={categories}
                        onSubmit={handleAddStock}
                        onSuccess={() => setShowAddForm(false)}
                    />
                )}

                <StockFilters
                    categories={categories}
                    filters={filters}
                    onFilterChange={setFilters}
                />

                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <StockTable
                        stock={stock}
                        onDelete={(item) => setDeleteDialog({ isOpen: true, item })}
                    />
                )}

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                <ConfirmDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={() => setDeleteDialog({ isOpen: false, item: null })}
                    onConfirm={handleDeleteStock}
                    title="Delete Stock Item"
                    message={`Are you sure you want to delete ${deleteDialog.item?.boxId}? This action cannot be undone.`}
                    confirmText="Delete"
                    type="danger"
                />
            </div>
        </ProtectedRoute>
    );
}

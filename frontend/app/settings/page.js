'use client';

import { useEffect, useState } from 'react';
import PresetCategories from '@/components/Settings/PresetCategories';
import CategoryList from '@/components/Settings/CategoryList';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Toast from '@/components/UI/Toast';
import ConfirmDialog from '@/components/UI/ConfirmDialog';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCategories, createCategory, deleteCategory } from '@/lib/api';

export default function SettingsPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, category: null });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setToast({ type: 'error', message: 'Failed to load categories' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (preset) => {
        try {
            await createCategory(preset);
            setToast({ type: 'success', message: 'Category added successfully' });
            fetchCategories();
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Failed to add category' });
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await deleteCategory(deleteDialog.category._id);
            setToast({ type: 'success', message: 'Category deleted successfully' });
            fetchCategories();
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Cannot delete category with existing stock' });
        }
    };

    return (
        <ProtectedRoute>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Settings - Category Management</h1>

                <PresetCategories onSelect={handleAddCategory} />

                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <CategoryList
                        categories={categories}
                        onDelete={(category) => setDeleteDialog({ isOpen: true, category })}
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
                    onClose={() => setDeleteDialog({ isOpen: false, category: null })}
                    onConfirm={handleDeleteCategory}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${deleteDialog.category?.name}"? This will only work if no stock items use this category.`}
                    confirmText="Delete"
                    type="danger"
                />
            </div>
        </ProtectedRoute>
    );
}

'use client';

import { Trash2 } from 'lucide-react';

const CategoryList = ({ categories, onDelete }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>

            <div className="space-y-2">
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                        <div
                            key={category._id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <div>
                                <div className="font-medium text-gray-900">{category.name}</div>
                                <div className="text-sm text-gray-500">
                                    {category.species} • {category.weightRange}
                                </div>
                            </div>
                            <button
                                onClick={() => onDelete(category)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete category"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-400">
                        No categories found. Add one using the preset categories above.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryList;

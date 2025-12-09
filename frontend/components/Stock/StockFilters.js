'use client';

import { Search } from 'lucide-react';

const StockFilters = ({ categories, filters, onFilterChange }) => {
    return (
        <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        className="input pl-10"
                        placeholder="Search by category name..."
                        value={filters.search || ''}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <select
                        className="input"
                        value={filters.category || 'all'}
                        onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <select
                        className="input"
                        value={filters.status || 'all'}
                        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="DOA">DOA</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default StockFilters;

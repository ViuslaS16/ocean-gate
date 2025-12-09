const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Categories
export const getCategories = () => apiCall('/categories');
export const createCategory = (data) => apiCall('/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id, data) => apiCall(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategory = (id) => apiCall(`/categories/${id}`, { method: 'DELETE' });

// Stock
export const getStock = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/stock${query ? '?' + query : ''}`);
};
export const getStockById = (id) => apiCall(`/stock/${id}`);
export const getAvailableStock = () => apiCall('/stock/available');
export const createStock = (data) => apiCall('/stock', { method: 'POST', body: JSON.stringify(data) });
export const updateStock = (id, data) => apiCall(`/stock/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteStock = (id) => apiCall(`/stock/${id}`, { method: 'DELETE' });

// Invoices
export const getInvoices = () => apiCall('/invoices');
export const getInvoiceById = (id) => apiCall(`/invoices/${id}`);
export const createInvoice = (data) => apiCall('/invoices', { method: 'POST', body: JSON.stringify(data) });
export const finalizeInvoice = (id) => apiCall(`/invoices/${id}/finalize`, { method: 'PUT' });
export const deleteInvoice = (id) => apiCall(`/invoices/${id}`, { method: 'DELETE' });

// DOA
export const getDOARecords = () => apiCall('/doa');
export const recordDOA = (data) => apiCall('/doa', { method: 'POST', body: JSON.stringify(data) });
export const deleteDOA = (id) => apiCall(`/doa/${id}`, { method: 'DELETE' });

// Dashboard
export const getDashboardMetrics = () => apiCall('/dashboard/metrics');

'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Password is required');
            return;
        }

        setLoading(true);
        try {
            await onConfirm(password);
            setPassword('');
            onClose();
        } catch (err) {
            setError(err.message || 'Invalid password');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title || 'Confirm Action'}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    {message || 'Please enter your password to confirm this action.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent pr-10"
                                placeholder="Enter your password"
                                disabled={loading}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Confirming...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

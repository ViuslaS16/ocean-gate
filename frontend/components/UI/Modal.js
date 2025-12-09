'use client';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
                {title && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {title}
                    </h3>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;

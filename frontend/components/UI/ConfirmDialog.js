'use client';

import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="btn-secondary"
                >
                    {cancelText}
                </button>
                <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className={type === 'danger' ? 'btn-danger' : 'btn-primary'}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;

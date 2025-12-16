import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: 'bg-red-100 text-status-error',
    warning: 'bg-yellow-100 text-status-warning',
    info: 'bg-blue-100 text-primary',
  };

  const buttonStyles = {
    danger: 'btn-error',
    warning: 'bg-status-warning text-white hover:bg-yellow-600',
    info: 'btn-primary',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-surface rounded-card shadow-card-hover w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="p-6 pb-4">
            <div className={`w-12 h-12 rounded-full ${typeStyles[type]} flex items-center justify-center mb-4`}>
              <AlertTriangle size={24} />
            </div>

            {/* Title & Message */}
            <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
            <p className="text-sm text-text-muted">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-card">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`btn ${buttonStyles[type]}`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

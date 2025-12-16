import React, { useState } from 'react';
import { UpdateFormData } from '@/types/update.types';

interface UpdateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateFormData) => Promise<void>;
}

const UpdateFormModal: React.FC<UpdateFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<UpdateFormData>({
    source: '',
    update_name: '',
    update_type: 'new_entries',
    priority: 'normal',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        source: '',
        update_name: '',
        update_type: 'new_entries',
        priority: 'normal',
        notes: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating update:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        source: '',
        update_name: '',
        update_type: 'new_entries',
        priority: 'normal',
        notes: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Tạo bản cập nhật mới
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nguồn dữ liệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                placeholder="Ví dụ: Viettel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Update Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên bản cập nhật <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="update_name"
                value={formData.update_name}
                onChange={handleChange}
                required
                placeholder="Ví dụ: Cập nhật gói cước Q4 2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Update Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại cập nhật <span className="text-red-500">*</span>
              </label>
              <select
                name="update_type"
                value={formData.update_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new_entries">Gói dịch vụ mới</option>
                <option value="modifications">Cập nhật gói hiện tại</option>
                <option value="corrections">Sửa lỗi dữ liệu</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {formData.update_type === 'new_entries' && 'Thêm các gói dịch vụ mới'}
                {formData.update_type === 'modifications' && 'Cập nhật thông tin gói đã có'}
                {formData.update_type === 'corrections' && 'Sửa chữa dữ liệu sai'}
              </p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Độ ưu tiên <span className="text-red-500">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Thấp</option>
                <option value="normal">Bình thường</option>
                <option value="high">Cao</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Thêm ghi chú về bản cập nhật..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo bản nháp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFormModal;

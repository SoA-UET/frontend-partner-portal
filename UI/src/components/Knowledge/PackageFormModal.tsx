import React, { useState, useEffect } from 'react';
import Modal from '@/components/Common/Modal';
import { Package, PackageFormData } from '@/types/knowledge.types';

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PackageFormData) => Promise<void>;
  package?: Package | null;
  mode: 'create' | 'edit';
}

const PackageFormModal: React.FC<PackageFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  package: pkg,
  mode,
}) => {
  const [formData, setFormData] = useState<PackageFormData>({
    'Mã dịch vụ': '',
    'Thời gian thanh toán': '',
    'Các dịch vụ tiên quyết': '',
    'Giá (VNĐ)': 0,
    'Chu kỳ (ngày)': 0,
    '4G tốc độ tiêu chuẩn/ngày': 0,
    '4G tốc độ cao/ngày': 0,
    '4G tốc độ tiêu chuẩn/chu kỳ': 0,
    '4G tốc độ cao/chu kỳ': 0,
    'Gọi nội mạng': '',
    'Gọi ngoại mạng': '',
    'Tin nhắn': '',
    'Chi tiết': '',
    'Tự động gia hạn': '',
    'Cú pháp đăng ký': '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pkg && mode === 'edit') {
      setFormData({
        'Mã dịch vụ': pkg['Mã dịch vụ'],
        'Thời gian thanh toán': pkg['Thời gian thanh toán'],
        'Các dịch vụ tiên quyết': pkg['Các dịch vụ tiên quyết'],
        'Giá (VNĐ)': pkg['Giá (VNĐ)'],
        'Chu kỳ (ngày)': pkg['Chu kỳ (ngày)'],
        '4G tốc độ tiêu chuẩn/ngày': pkg['4G tốc độ tiêu chuẩn/ngày'],
        '4G tốc độ cao/ngày': pkg['4G tốc độ cao/ngày'],
        '4G tốc độ tiêu chuẩn/chu kỳ': pkg['4G tốc độ tiêu chuẩn/chu kỳ'],
        '4G tốc độ cao/chu kỳ': pkg['4G tốc độ cao/chu kỳ'],
        'Gọi nội mạng': pkg['Gọi nội mạng'],
        'Gọi ngoại mạng': pkg['Gọi ngoại mạng'],
        'Tin nhắn': pkg['Tin nhắn'],
        'Chi tiết': pkg['Chi tiết'],
        'Tự động gia hạn': pkg['Tự động gia hạn'],
        'Cú pháp đăng ký': pkg['Cú pháp đăng ký'],
      });
    } else {
      // Reset form
      setFormData({
        'Mã dịch vụ': '',
        'Thời gian thanh toán': '',
        'Các dịch vụ tiên quyết': '',
        'Giá (VNĐ)': 0,
        'Chu kỳ (ngày)': 0,
        '4G tốc độ tiêu chuẩn/ngày': 0,
        '4G tốc độ cao/ngày': 0,
        '4G tốc độ tiêu chuẩn/chu kỳ': 0,
        '4G tốc độ cao/chu kỳ': 0,
        'Gọi nội mạng': '',
        'Gọi ngoại mạng': '',
        'Tin nhắn': '',
        'Chi tiết': '',
        'Tự động gia hạn': '',
        'Cú pháp đăng ký': '',
      });
    }
    setErrors({});
  }, [pkg, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData['Mã dịch vụ'].trim()) {
      newErrors['Mã dịch vụ'] = 'Vui lòng nhập mã dịch vụ';
    }
    if (formData['Giá (VNĐ)'] < 0) {
      newErrors['Giá (VNĐ)'] = 'Giá phải lớn hơn hoặc bằng 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Có lỗi xảy ra' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof PackageFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Thêm gói cước mới' : 'Chỉnh sửa gói cước'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-button">
            <p className="text-sm text-status-error">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Mã dịch vụ */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Mã dịch vụ <span className="text-status-error">*</span>
            </label>
            <input
              type="text"
              value={formData['Mã dịch vụ']}
              onChange={(e) => handleChange('Mã dịch vụ', e.target.value)}
              className={`input ${errors['Mã dịch vụ'] ? 'border-status-error' : ''}`}
              disabled={isLoading}
            />
            {errors['Mã dịch vụ'] && (
              <p className="text-xs text-status-error mt-1">{errors['Mã dịch vụ']}</p>
            )}
          </div>

          {/* Thời gian thanh toán */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Thời gian thanh toán
            </label>
            <input
              type="text"
              value={formData['Thời gian thanh toán']}
              onChange={(e) => handleChange('Thời gian thanh toán', e.target.value)}
              className="input"
              placeholder="Trả trước/Trả sau"
              disabled={isLoading}
            />
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Giá (VNĐ)
            </label>
            <input
              type="number"
              value={formData['Giá (VNĐ)']}
              onChange={(e) => handleChange('Giá (VNĐ)', Number(e.target.value))}
              className={`input ${errors['Giá (VNĐ)'] ? 'border-status-error' : ''}`}
              disabled={isLoading}
            />
            {errors['Giá (VNĐ)'] && (
              <p className="text-xs text-status-error mt-1">{errors['Giá (VNĐ)']}</p>
            )}
          </div>

          {/* Chu kỳ */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Chu kỳ (ngày)
            </label>
            <input
              type="number"
              value={formData['Chu kỳ (ngày)']}
              onChange={(e) => handleChange('Chu kỳ (ngày)', Number(e.target.value))}
              className="input"
              disabled={isLoading}
            />
          </div>

          {/* 4G tốc độ tiêu chuẩn/ngày */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              4G tốc độ tiêu chuẩn/ngày (GB)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData['4G tốc độ tiêu chuẩn/ngày']}
              onChange={(e) => handleChange('4G tốc độ tiêu chuẩn/ngày', Number(e.target.value))}
              className="input"
              disabled={isLoading}
            />
          </div>

          {/* 4G tốc độ cao/ngày */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              4G tốc độ cao/ngày (GB)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData['4G tốc độ cao/ngày']}
              onChange={(e) => handleChange('4G tốc độ cao/ngày', Number(e.target.value))}
              className="input"
              disabled={isLoading}
            />
          </div>

          {/* 4G tốc độ tiêu chuẩn/chu kỳ */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              4G tốc độ tiêu chuẩn/chu kỳ (GB)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData['4G tốc độ tiêu chuẩn/chu kỳ']}
              onChange={(e) => handleChange('4G tốc độ tiêu chuẩn/chu kỳ', Number(e.target.value))}
              className="input"
              disabled={isLoading}
            />
          </div>

          {/* 4G tốc độ cao/chu kỳ */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              4G tốc độ cao/chu kỳ (GB)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData['4G tốc độ cao/chu kỳ']}
              onChange={(e) => handleChange('4G tốc độ cao/chu kỳ', Number(e.target.value))}
              className="input"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Các dịch vụ tiên quyết */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Các dịch vụ tiên quyết
          </label>
          <input
            type="text"
            value={formData['Các dịch vụ tiên quyết']}
            onChange={(e) => handleChange('Các dịch vụ tiên quyết', e.target.value)}
            className="input"
            disabled={isLoading}
          />
        </div>

        {/* Gọi nội mạng */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Gọi nội mạng
          </label>
          <input
            type="text"
            value={formData['Gọi nội mạng']}
            onChange={(e) => handleChange('Gọi nội mạng', e.target.value)}
            className="input"
            disabled={isLoading}
          />
        </div>

        {/* Gọi ngoại mạng */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Gọi ngoại mạng
          </label>
          <input
            type="text"
            value={formData['Gọi ngoại mạng']}
            onChange={(e) => handleChange('Gọi ngoại mạng', e.target.value)}
            className="input"
            disabled={isLoading}
          />
        </div>

        {/* Tin nhắn */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Tin nhắn
          </label>
          <input
            type="text"
            value={formData['Tin nhắn']}
            onChange={(e) => handleChange('Tin nhắn', e.target.value)}
            className="input"
            disabled={isLoading}
          />
        </div>

        {/* Chi tiết */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Chi tiết
          </label>
          <textarea
            value={formData['Chi tiết']}
            onChange={(e) => handleChange('Chi tiết', e.target.value)}
            className="input"
            rows={3}
            disabled={isLoading}
          />
        </div>

        {/* Tự động gia hạn */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Tự động gia hạn
          </label>
          <input
            type="text"
            value={formData['Tự động gia hạn']}
            onChange={(e) => handleChange('Tự động gia hạn', e.target.value)}
            className="input"
            disabled={isLoading}
          />
        </div>

        {/* Cú pháp đăng ký */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Cú pháp đăng ký
          </label>
          <input
            type="text"
            value={formData['Cú pháp đăng ký']}
            onChange={(e) => handleChange('Cú pháp đăng ký', e.target.value)}
            className="input"
            disabled={isLoading}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            Hủy
          </button>
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Thêm gói cước' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PackageFormModal;

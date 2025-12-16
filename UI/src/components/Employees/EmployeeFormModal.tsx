import React, { useState, useEffect } from 'react';
import Modal from '@/components/Common/Modal';
import { CreateEmployeeRequest, UpdateEmployeeRequest, Employee, Role } from '@/types/employee.types';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeRequest | UpdateEmployeeRequest) => Promise<void>;
  employee?: Employee | null;
  roles: Role[];
  mode: 'create' | 'edit';
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
  roles,
  mode,
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role_id: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'LOCKED',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when employee changes
  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        full_name: employee.full_name,
        email: employee.email,
        role_id: employee.role_id,
        status: employee.status,
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        role_id: roles[0]?.id || '',
        status: 'ACTIVE',
      });
    }
    setErrors({});
  }, [employee, mode, roles, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Họ tên không được để trống';
    }

    if (mode === 'create' && !formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    }

    if (mode === 'create' && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'Vui lòng chọn vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'create') {
        const createData: CreateEmployeeRequest = {
          full_name: formData.full_name,
          email: formData.email,
          role_id: formData.role_id,
        };
        await onSubmit(createData);
      } else {
        const updateData: UpdateEmployeeRequest = {
          full_name: formData.full_name,
          role_id: formData.role_id,
          status: formData.status,
        };
        await onSubmit(updateData);
      }
      onClose();
    } catch (error: any) {
      if (error.response?.data?.error_code === 'EMAIL_ALREADY_EXISTS') {
        setErrors({ email: 'Email đã tồn tại trong hệ thống' });
      } else {
        setErrors({ general: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
      title={mode === 'create' ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-button">
            <p className="text-sm text-status-error">{errors.general}</p>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-text-main mb-1">
            Họ và tên <span className="text-status-error">*</span>
          </label>
          <input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className={`input ${errors.full_name ? 'border-status-error' : ''}`}
            placeholder="Nguyễn Văn A"
            disabled={isLoading}
          />
          {errors.full_name && (
            <p className="text-xs text-status-error mt-1">{errors.full_name}</p>
          )}
        </div>

        {/* Email - Only for create mode */}
        {mode === 'create' && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1">
              Email <span className="text-status-error">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`input ${errors.email ? 'border-status-error' : ''}`}
              placeholder="email@partner.vn"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-status-error mt-1">{errors.email}</p>
            )}
          </div>
        )}

        {/* Email display only - For edit mode */}
        {mode === 'edit' && (
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Email</label>
            <input
              type="text"
              value={formData.email}
              className="input bg-gray-50"
              disabled
            />
            <p className="text-xs text-text-muted mt-1">Email không thể thay đổi</p>
          </div>
        )}

        {/* Role */}
        <div>
          <label htmlFor="role_id" className="block text-sm font-medium text-text-main mb-1">
            Vai trò <span className="text-status-error">*</span>
          </label>
          <select
            id="role_id"
            value={formData.role_id}
            onChange={(e) => handleChange('role_id', e.target.value)}
            className={`input ${errors.role_id ? 'border-status-error' : ''}`}
            disabled={isLoading}
          >
            <option value="">-- Chọn vai trò --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role_id && (
            <p className="text-xs text-status-error mt-1">{errors.role_id}</p>
          )}
        </div>

        {/* Status - Only for edit mode */}
        {mode === 'edit' && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-text-main mb-1">
              Trạng thái
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="input"
              disabled={isLoading}
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
              <option value="LOCKED">Bị khóa</option>
            </select>
          </div>
        )}

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
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang lưu...</span>
              </>
            ) : mode === 'create' ? (
              'Thêm mới'
            ) : (
              'Cập nhật'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;

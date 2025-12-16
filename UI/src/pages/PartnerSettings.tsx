import React, { useState, useEffect } from 'react';
import { Save, Building2, Loader2 } from 'lucide-react';
import { PartnerInfo } from '@/types/partner.types';
import partnerService from '@/services/partnerService';

const PartnerSettings: React.FC = () => {
  const [formData, setFormData] = useState<PartnerInfo>({
    name: '',
    partner_id: '',
    api_key: '',
    core_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        const response = await partnerService.getPartnerInfo();
        setFormData(response.data);
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Không thể tải thông tin Partner', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerInfo();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (field: keyof PartnerInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name?.trim()) {
      showToast('Vui lòng nhập tên nhà mạng', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await partnerService.updatePartnerInfo({
        name: formData.name,
        partner_id: formData.partner_id,
        api_key: formData.api_key,
        core_url: formData.core_url,
      });
      setFormData(response.data);
      showToast('Cập nhật thông tin Partner thành công', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Không thể cập nhật thông tin', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-muted">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-button shadow-card flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-status-success text-white'
                : 'bg-status-error text-white'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary-50 rounded-button">
          <Building2 className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-main">Cấu hình thông tin Partner</h1>
          <p className="text-meta mt-1">Quản lý thông tin chung của nhà mạng Partner</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card max-w-3xl">
        <div className="space-y-6">
          {/* Partner Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-main mb-2">
              Tên nhà mạng <span className="text-status-error">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input"
              placeholder="VD: Viettel Telecom, Vinaphone..."
              disabled={isSaving}
              required
            />
            <p className="text-xs text-text-muted mt-1">
              Tên hiển thị của nhà mạng Partner
            </p>
          </div>

          {/* Partner ID (Read-only) */}
          <div>
            <label htmlFor="partner_id" className="block text-sm font-medium text-text-main mb-2">
              Partner ID
            </label>
            <input
              id="partner_id"
              type="text"
              value={formData.partner_id || 'Chưa kết nối với Core'}
              className="input bg-gray-50"
              disabled
              readOnly
            />
            <p className="text-xs text-text-muted mt-1">
              ID được cấp bởi Telcenter Core khi thiết lập kết nối
            </p>
          </div>

          {/* API Key (Read-only) */}
          <div>
            <label htmlFor="api_key" className="block text-sm font-medium text-text-main mb-2">
              API Key
            </label>
            <input
              id="api_key"
              type="password"
              value={formData.api_key || ''}
              className="input bg-gray-50"
              disabled
              readOnly
            />
            <p className="text-xs text-text-muted mt-1">
              API Key để xác thực với Telcenter Core (chỉ đọc)
            </p>
          </div>

          {/* Core URL (Read-only) */}
          <div>
            <label htmlFor="core_url" className="block text-sm font-medium text-text-main mb-2">
              Core URL
            </label>
            <input
              id="core_url"
              type="text"
              value={formData.core_url || ''}
              className="input bg-gray-50"
              disabled
              readOnly
            />
            <p className="text-xs text-text-muted mt-1">
              URL endpoint của Telcenter Core (thiết lập tại trang Kết nối Core)
            </p>
          </div>

          {/* Timestamps */}
          {formData.created_at && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs font-medium text-text-muted mb-1">Ngày tạo</p>
                <p className="text-sm text-text-main">
                  {new Date(formData.created_at).toLocaleString('vi-VN')}
                </p>
              </div>
              {formData.updated_at && (
                <div>
                  <p className="text-xs font-medium text-text-muted mb-1">Cập nhật lần cuối</p>
                  <p className="text-sm text-text-main">
                    {new Date(formData.updated_at).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PartnerSettings;

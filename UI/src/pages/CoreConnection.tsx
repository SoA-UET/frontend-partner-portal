import React, { useState, useEffect } from 'react';
import { Link2, AlertCircle, CheckCircle, Loader2, Save } from 'lucide-react';
import partnerService from '@/services/partnerService';

const CoreConnection: React.FC = () => {
  const [formData, setFormData] = useState({
    core_url: '',
    api_key: '',
  });
  const [partnerId, setPartnerId] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        const response = await partnerService.getPartnerInfo();
        setFormData({
          core_url: response.data.core_url || '',
          api_key: response.data.api_key || '',
        });
        setPartnerId(response.data.partner_id || '');
        if (response.data.core_url && response.data.api_key) {
          setTestStatus('success');
          setTestMessage('Kết nối đã được thiết lập');
        }
      } catch (error: any) {
        // Ignore error if partner info not found yet
      }
    };

    fetchPartnerInfo();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTestStatus('idle');
    setTestMessage('');
  };

  const handleTestConnection = async () => {
    // Validation
    if (!formData.core_url.trim() || !formData.api_key.trim()) {
      showToast('Vui lòng nhập đầy đủ Core URL và API Key', 'error');
      return;
    }

    setIsTesting(true);
    setTestStatus('idle');
    setTestMessage('');

    try {
      const response = await partnerService.testCoreConnection({
        core_url: formData.core_url,
        api_key: formData.api_key,
      });

      if (response.status === 'success') {
        setTestStatus('success');
        setTestMessage('Kết nối thành công!');
        setPartnerId(response.message.partner_id);
        showToast(`Kết nối thành công! Partner ID: ${response.message.partner_id}`, 'success');
      }
    } catch (error: any) {
      setTestStatus('error');
      setTestMessage(error.response?.data?.message || 'Không thể kết nối đến Core');
      showToast('Test kết nối thất bại', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (testStatus !== 'success') {
      showToast('Vui lòng test kết nối thành công trước khi lưu', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await partnerService.updatePartnerInfo({
        core_url: formData.core_url,
        api_key: formData.api_key,
        partner_id: partnerId,
      });
      showToast('Lưu cấu hình kết nối thành công', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Không thể lưu cấu hình', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
          <Link2 className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-main">Kết nối Telcenter Core</h1>
          <p className="text-meta mt-1">Thiết lập và kiểm tra kết nối đến hệ thống Core</p>
        </div>
      </div>

      {/* Connection Status Card */}
      {partnerId && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-primary" size={24} />
            <div>
              <p className="font-semibold text-text-main">Kết nối đang hoạt động</p>
              <p className="text-sm text-text-muted">Partner ID: <span className="font-mono">{partnerId}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <div className="card max-w-3xl">
        <div className="space-y-6">
          {/* Core URL */}
          <div>
            <label htmlFor="core_url" className="block text-sm font-medium text-text-main mb-2">
              Core URL <span className="text-status-error">*</span>
            </label>
            <input
              id="core_url"
              type="url"
              value={formData.core_url}
              onChange={(e) => handleChange('core_url', e.target.value)}
              className="input"
              placeholder="https://core.telcenter.vn"
              disabled={isTesting || isSaving}
            />
            <p className="text-xs text-text-muted mt-1">
              URL endpoint của hệ thống Telcenter Core
            </p>
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="api_key" className="block text-sm font-medium text-text-main mb-2">
              API Key <span className="text-status-error">*</span>
            </label>
            <input
              id="api_key"
              type="password"
              value={formData.api_key}
              onChange={(e) => handleChange('api_key', e.target.value)}
              className="input"
              placeholder="Nhập API Key được cấp bởi Core"
              disabled={isTesting || isSaving}
            />
            <p className="text-xs text-text-muted mt-1">
              API Key để xác thực với Telcenter Core
            </p>
          </div>

          {/* Test Status */}
          {testMessage && (
            <div
              className={`p-4 rounded-button flex items-center gap-3 ${
                testStatus === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : testStatus === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle className="text-status-success flex-shrink-0" size={20} />
              ) : testStatus === 'error' ? (
                <AlertCircle className="text-status-error flex-shrink-0" size={20} />
              ) : null}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    testStatus === 'success'
                      ? 'text-green-800'
                      : testStatus === 'error'
                      ? 'text-red-800'
                      : 'text-gray-800'
                  }`}
                >
                  {testMessage}
                </p>
                {testStatus === 'success' && partnerId && (
                  <p className="text-xs text-green-700 mt-1">
                    Partner ID: <span className="font-mono">{partnerId}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || isSaving}
              className="btn btn-secondary flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <Link2 size={18} />
                  Test kết nối
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={testStatus !== 'success' || isSaving}
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
                  Lưu cấu hình
                </>
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-button p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Hướng dẫn:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Nhập URL Core và API Key được cấp bởi quản trị viên Telcenter Core</li>
              <li>Nhấn "Test kết nối" để kiểm tra thông tin kết nối</li>
              <li>Nếu kết nối thành công, nhấn "Lưu cấu hình" để lưu lại</li>
              <li>Partner ID sẽ được hiển thị sau khi kết nối thành công</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreConnection;

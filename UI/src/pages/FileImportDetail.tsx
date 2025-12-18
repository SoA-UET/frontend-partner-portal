import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';
import { FileImportDetail as FileImportDetailType, Package } from '@/types/knowledge.types';
import knowledgeService from '@/services/knowledgeService';
import ConfirmDialog from '@/components/Common/ConfirmDialog';

const FileImportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fileImport, setFileImport] = useState<FileImportDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (id) fetchFileImport();
  }, [id]);

  const fetchFileImport = async () => {
    if (!id) return;
    try {
      const data = await knowledgeService.getFileImportDetail(id);
      setFileImport(data);
    } catch (error) {
      showToast('Không thể tải chi tiết file import', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // TP-13e: Approve
  const handleApprove = async () => {
    if (!id) return;
    setIsProcessing(true);
    try {
      await knowledgeService.approveFileImport(id);
      showToast('Duyệt file import thành công', 'success');
      await fetchFileImport();
      setShowApproveDialog(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Không thể duyệt file import', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // TP-13f: Reject
  const handleReject = async () => {
    if (!id) return;
    setIsProcessing(true);
    try {
      await knowledgeService.rejectFileImport(id);
      showToast('Từ chối file import thành công', 'success');
      await fetchFileImport();
      setShowRejectDialog(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Không thể từ chối file import', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      PENDING: { className: 'badge-warning', icon: AlertCircle, text: 'Đang xử lý' },
      EXTRACTED: { className: 'badge-info', icon: CheckCircle, text: 'Đã trích xuất' },
      FAILED: { className: 'badge-error', icon: XCircle, text: 'Thất bại' },
      APPROVED: { className: 'badge-success', icon: CheckCircle, text: 'Đã duyệt' },
      REJECTED: { className: 'badge-error', icon: XCircle, text: 'Đã từ chối' },
    };
    const config = configs[status];
    const Icon = config.icon;
    return (
      <span className={`badge ${config.className} flex items-center gap-1`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
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

  if (!fileImport) {
    return (
      <div className="card text-center py-12">
        <p className="text-text-muted">Không tìm thấy file import</p>
      </div>
    );
  }

  const canApprove = fileImport.status === 'EXTRACTED';

  // All Package fields except 'id' in display order
  const packageFields: Array<keyof Omit<Package, 'id'>> = [
    'Mã dịch vụ',
    'Thời gian thanh toán',
    'Các dịch vụ tiên quyết',
    'Giá (VNĐ)',
    'Chu kỳ (ngày)',
    '4G tốc độ tiêu chuẩn/ngày',
    '4G tốc độ cao/ngày',
    '4G tốc độ tiêu chuẩn/chu kỳ',
    '4G tốc độ cao/chu kỳ',
    'Gọi nội mạng',
    'Gọi ngoại mạng',
    'Tin nhắn',
    'Chi tiết',
    'Tự động gia hạn',
    'Cú pháp đăng ký',
  ];

  const renderCell = (pkg: Omit<Package, 'id'>, field: keyof Omit<Package, 'id'>) => {
    const value = pkg?.[field];
    if (value == null || value === '') return '-';
    if (typeof value === 'number') {
      // Append unit for cycle field, format all numbers in vi-VN
      if (field === 'Chu kỳ (ngày)') return `${value.toLocaleString('vi-VN')} ngày`;
      return value.toLocaleString('vi-VN');
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-4 py-3 rounded-button shadow-card text-white ${toast.type === 'success' ? 'bg-status-success' : 'bg-status-error'}`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/file-imports')} className="p-2 hover:bg-gray-100 rounded-button">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-50 rounded-button">
              <FileText className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-main">Chi tiết File Import</h1>
              <p className="text-meta mt-1">{fileImport.file_name}</p>
            </div>
          </div>
        </div>
        {canApprove && (
          <div className="flex gap-2">
            <button onClick={() => setShowRejectDialog(true)} className="btn btn-secondary">
              <XCircle size={18} />
              Từ chối
            </button>
            <button onClick={() => setShowApproveDialog(true)} className="btn btn-primary">
              <CheckCircle size={18} />
              Duyệt
            </button>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="card">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-medium text-text-muted mb-1">Trạng thái</p>
            {getStatusBadge(fileImport.status)}
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted mb-1">Ngày tạo</p>
            <p className="text-sm text-text-main">{new Date(fileImport.created_at).toLocaleString('vi-VN')}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted mb-1">Số gói cước</p>
            <p className="text-sm text-text-main">{fileImport.packages.length}</p>
          </div>
        </div>
        {fileImport.error_message && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-button">
            <p className="text-sm text-status-error">{fileImport.error_message}</p>
          </div>
        )}
      </div>

      {/* Packages */}
      {fileImport.packages.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-text-main">Danh sách gói cước đã trích xuất</h2>
          </div>
          {/* Enable horizontal and vertical scrolling */}
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table className="w-full min-w-max text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {packageFields.map((field) => (
                    <th key={field} className="px-6 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fileImport.packages.map((pkg: Omit<Package, 'id'>, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {packageFields.map((field) => (
                      <td key={`${idx}-${field}`} className="px-6 py-4 whitespace-nowrap">
                        {renderCell(pkg, field)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
        title="Xác nhận duyệt"
        message={`Bạn có chắc chắn muốn duyệt ${fileImport.packages.length} gói cước từ file này?`}
        confirmText="Duyệt"
        isLoading={isProcessing}
      />

      <ConfirmDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        title="Xác nhận từ chối"
        message="Bạn có chắc chắn muốn từ chối file import này?"
        confirmText="Từ chối"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default FileImportDetail;

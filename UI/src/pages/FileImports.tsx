import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { FileImport } from '@/types/knowledge.types';
import knowledgeService from '@/services/knowledgeService';
import Modal from '@/components/Common/Modal';

const FileImports: React.FC = () => {
  const [fileImports, setFileImports] = useState<FileImport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchFileImports();
  }, []);

  const fetchFileImports = async () => {
    try {
      const data = await knowledgeService.getFileImports();
      setFileImports(data);
    } catch (error) {
      showToast('Không thể tải danh sách file imports', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // TP-13a: Upload file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.name.endsWith('.pdf')) {
        showToast('Chỉ chấp nhận file PDF', 'error');
        return;
      }
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        showToast('File không được vượt quá 50MB', 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('Vui lòng chọn file để upload', 'error');
      return;
    }

    setIsUploading(true);
    try {
      await knowledgeService.uploadFileImport(selectedFile);
      showToast('Upload file thành công! Hệ thống đang xử lý...', 'success');
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      await fetchFileImports();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Upload file thất bại', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: FileImport['status']) => {
    const statusConfig = {
      PENDING: { className: 'badge-warning', icon: Clock, text: 'Đang xử lý' },
      EXTRACTED: { className: 'badge-info', icon: CheckCircle, text: 'Đã trích xuất' },
      FAILED: { className: 'badge-error', icon: XCircle, text: 'Thất bại' },
      APPROVED: { className: 'badge-success', icon: CheckCircle, text: 'Đã duyệt' },
      REJECTED: { className: 'badge-error', icon: XCircle, text: 'Đã từ chối' },
    };
    const config = statusConfig[status];
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

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-button shadow-card flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-status-success text-white' : 'bg-status-error text-white'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-50 rounded-button">
            <FileText className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-main">Import dữ liệu kiến thức</h1>
            <p className="text-meta mt-1">Quản lý việc import file dữ liệu gói cước từ PDF</p>
          </div>
        </div>
        <button onClick={() => setIsUploadModalOpen(true)} className="btn btn-primary">
          <Upload size={18} />
          Upload File
        </button>
      </div>

      {/* File Imports Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase">Tên file</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-text-main uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {fileImports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-text-muted">Chưa có file import nào</p>
                  </td>
                </tr>
              ) : (
                fileImports.map((fileImport) => (
                  <tr key={fileImport.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-text-muted" />
                        <span className="font-medium text-text-main">{fileImport.file_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(fileImport.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-text-muted">
                        {new Date(fileImport.created_at).toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/file-imports/${fileImport.id}`}
                        className="text-primary hover:text-primary-600 font-medium"
                      >
                        Xem chi tiết →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFile(null);
        }}
        title="Upload file dữ liệu"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-button p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Yêu cầu file:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Định dạng: PDF</li>
                  <li>Kích thước tối đa: 50MB</li>
                  <li>Nội dung: Thông tin các gói cước viễn thông</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Chọn file PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="input"
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="text-sm text-text-muted mt-2">
                Đã chọn: <span className="font-medium">{selectedFile.name}</span> (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedFile(null);
              }}
              disabled={isUploading}
              className="btn btn-secondary"
            >
              Hủy
            </button>
            <button onClick={handleUpload} disabled={!selectedFile || isUploading} className="btn btn-primary">
              {isUploading ? 'Đang upload...' : 'Upload'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FileImports;

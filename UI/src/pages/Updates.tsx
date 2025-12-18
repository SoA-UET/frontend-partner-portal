import React, { useState, useEffect } from 'react';
import updateService from '@/services/updateService';
import {
  Update,
  UpdateFormData,
  UpdateStatus,
  UpdateType,
  Priority,
} from '@/types/update.types';
import UpdateFormModal from '@/components/Updates/UpdateFormModal';

const Updates: React.FC = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitConfirm, setSubmitConfirm] = useState<string | null>(null);

  // Mock data for development (replace with API call when available)
  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    try {
      setIsLoading(true);
      const data = await updateService.getUpdates();
      setUpdates(data);
    } catch (error) {
      console.error('Error loading updates:', error);
      // Show empty state on error
      setUpdates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUpdate = async (data: UpdateFormData) => {
    try {
      const response = await updateService.createUpdate(data);
      // Add new update to list
      setUpdates((prev) => [response.update, ...prev]);
    } catch (error) {
      console.error('Error creating update:', error);
      throw error;
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    try {
      await updateService.deleteUpdate(updateId);
      // Remove from list
      setUpdates((prev) => prev.filter((u) => u.update_id !== updateId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Không thể xóa bản cập nhật. Vui lòng thử lại.');
    }
  };

  const handleSubmitUpdate = async (updateId: string) => {
    try {
      const response = await updateService.submitUpdate(updateId);
      
      // Update status in list
      setUpdates((prev) =>
        prev.map((u) =>
          u.update_id === updateId
            ? { ...u, status: response.status as UpdateStatus, submitted_at: response.submitted_at }
            : u
        )
      );
      
      setSubmitConfirm(null);
      
      // Show success message
      alert(response.message || 'Đã gửi bản cập nhật lên Telcenter Core thành công!');
    } catch (error) {
      console.error('Error submitting update:', error);
      alert('Không thể gửi bản cập nhật. Vui lòng kiểm tra kết nối Core.');
    }
  };

  const getStatusBadge = (status: UpdateStatus) => {
    const styles: Record<UpdateStatus, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      validating: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    const labels: Record<UpdateStatus, string> = {
      draft: 'Bản nháp',
      submitted: 'Đã gửi',
      validating: 'Đang xác thực',
      approved: 'Đã phê duyệt',
      rejected: 'Bị từ chối',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const getUpdateTypeLabel = (type: UpdateType): string => {
    const labels: Record<UpdateType, string> = {
      new_entries: 'Gói dịch vụ mới',
      modifications: 'Cập nhật gói hiện tại',
      corrections: 'Sửa lỗi dữ liệu',
    };
    return labels[type];
  };

  const getPriorityBadge = (priority: Priority) => {
    const styles: Record<Priority, string> = {
      high: 'bg-red-50 text-red-700 border-red-200',
      normal: 'bg-blue-50 text-blue-700 border-blue-200',
      low: 'bg-gray-50 text-gray-600 border-gray-200',
    };

    const labels: Record<Priority, string> = {
      high: 'Cao',
      normal: 'Bình thường',
      low: 'Thấp',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded border ${styles[priority]}`}
      >
        {labels[priority]}
      </span>
    );
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý cập nhật dữ liệu
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            TP-14, TP-15, TP-16: Tạo, xóa và gửi bản cập nhật lên Telcenter Core
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Tạo bản cập nhật mới
        </button>
      </div>

      {/* Updates List */}
      {updates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Chưa có bản cập nhật nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tạo bản cập nhật mới để bắt đầu
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên bản cập nhật
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nguồn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ ưu tiên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {updates.map((update) => (
                <tr key={update.update_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {update.update_name}
                    </div>
                    {update.notes && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {update.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {update.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getUpdateTypeLabel(update.update_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(update.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {update.entry_count} entries
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(update.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(update.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* TP-16: Submit to Core (only for draft) */}
                      {update.status === 'draft' && (
                        <button
                          onClick={() => setSubmitConfirm(update.update_id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Gửi lên Core"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </button>
                      )}

                      {/* TP-15: Delete (only for draft) */}
                      {update.status === 'draft' && (
                        <button
                          onClick={() => setDeleteConfirm(update.update_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Status indicator for non-draft */}
                      {update.status !== 'draft' && (
                        <span className="text-gray-400 text-xs">
                          {update.status === 'validating' && 'Đang xử lý...'}
                          {update.status === 'approved' && '✓ Hoàn tất'}
                          {update.status === 'rejected' && '✗ Từ chối'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Update Modal */}
      <UpdateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUpdate}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc chắn muốn xóa bản cập nhật này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteUpdate(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      {submitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gửi lên Telcenter Core
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc chắn muốn gửi bản cập nhật này lên Telcenter Core để xác thực?
              Sau khi gửi, bạn không thể chỉnh sửa hoặc xóa bản cập nhật này.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSubmitConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleSubmitUpdate(submitConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Gửi đi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Updates;

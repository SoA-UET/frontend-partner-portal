import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package as PackageIcon } from 'lucide-react';
import { Package, PackageFormData } from '@/types/knowledge.types';
import knowledgeService from '@/services/knowledgeService';
import PackageFormModal from '@/components/Knowledge/PackageFormModal';
import ConfirmDialog from '@/components/Common/ConfirmDialog';

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await knowledgeService.getPackages();
      setPackages(data);
    } catch (error) {
      showToast('Không thể tải danh sách gói cước', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // TP-07: Add package
  const handleAddPackage = () => {
    setFormMode('create');
    setSelectedPackage(null);
    setIsFormModalOpen(true);
  };

  // TP-08: Edit package
  const handleEditPackage = (pkg: Package) => {
    setFormMode('edit');
    setSelectedPackage(pkg);
    setIsFormModalOpen(true);
  };

  // TP-09: Delete package
  const handleDeleteClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPackage) return;

    setIsDeleting(true);
    try {
      await knowledgeService.deletePackage(selectedPackage.id);
      await fetchPackages();
      showToast('Xóa gói cước thành công', 'success');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('Không thể xóa gói cước. Vui lòng thử lại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: PackageFormData) => {
    try {
      if (formMode === 'create') {
        await knowledgeService.createPackage(data);
        showToast('Thêm gói cước thành công', 'success');
      } else if (selectedPackage) {
        await knowledgeService.updatePackage(selectedPackage.id, data);
        showToast('Cập nhật gói cước thành công', 'success');
      }
      await fetchPackages();
      setIsFormModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  // Filter packages
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg['Mã dịch vụ'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg['Chi tiết'].toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <PackageIcon className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-main">Quản lý gói cước</h1>
            <p className="text-meta mt-1">Quản lý các gói cước viễn thông của Partner</p>
          </div>
        </div>
        <button onClick={handleAddPackage} className="btn btn-primary">
          <Plus size={18} />
          Thêm gói cước
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã dịch vụ hoặc chi tiết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Packages Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase">Mã dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase">Giá (VNĐ)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase">Chu kỳ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase">Chi tiết</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-text-main uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-text-muted">Không tìm thấy gói cước nào</p>
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-text-main">{pkg['Mã dịch vụ']}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-text-main">{pkg['Giá (VNĐ)'].toLocaleString('vi-VN')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-text-muted">{pkg['Chu kỳ (ngày)']} ngày</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-text-muted text-sm">
                        {pkg['4G tốc độ cao/chu kỳ'] > 0 ? `${pkg['4G tốc độ cao/chu kỳ']}GB` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-text-muted text-sm truncate max-w-xs">{pkg['Chi tiết']}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="p-2 text-primary hover:bg-primary-50 rounded-button transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pkg)}
                          className="p-2 text-status-error hover:bg-red-50 rounded-button transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Form Modal */}
      <PackageFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        package={selectedPackage}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa gói cước"
        message={`Bạn có chắc chắn muốn xóa gói cước "${selectedPackage?.['Mã dịch vụ']}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Packages;

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, HelpCircle } from 'lucide-react';
import { FAQ, FAQFormData } from '@/types/knowledge.types';
import knowledgeService from '@/services/knowledgeService';
import FAQFormModal from '@/components/Knowledge/FAQFormModal';
import ConfirmDialog from '@/components/Common/ConfirmDialog';

const FAQs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const data = await knowledgeService.getFAQs();
      setFaqs(data);
    } catch (error) {
      showToast('Không thể tải danh sách FAQ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // TP-10: Add FAQ
  const handleAddFAQ = () => {
    setFormMode('create');
    setSelectedFAQ(null);
    setIsFormModalOpen(true);
  };

  // TP-11: Edit FAQ
  const handleEditFAQ = (faq: FAQ) => {
    setFormMode('edit');
    setSelectedFAQ(faq);
    setIsFormModalOpen(true);
  };

  // TP-12: Delete FAQ
  const handleDeleteClick = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFAQ) return;

    setIsDeleting(true);
    try {
      await knowledgeService.deleteFAQ(selectedFAQ.id);
      await fetchFAQs();
      showToast('Xóa FAQ thành công', 'success');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('Không thể xóa FAQ. Vui lòng thử lại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: FAQFormData) => {
    try {
      if (formMode === 'create') {
        await knowledgeService.createFAQ(data);
        showToast('Thêm FAQ thành công', 'success');
      } else if (selectedFAQ) {
        await knowledgeService.updateFAQ(selectedFAQ.id, data);
        showToast('Cập nhật FAQ thành công', 'success');
      }
      await fetchFAQs();
      setIsFormModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  // Filter FAQs
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
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
            <HelpCircle className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-main">Câu hỏi thường gặp</h1>
            <p className="text-meta mt-1">Quản lý các câu hỏi và câu trả lời thường gặp</p>
          </div>
        </div>
        <button onClick={handleAddFAQ} className="btn btn-primary">
          <Plus size={18} />
          Thêm FAQ
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="card py-12">
            <p className="text-center text-text-muted">Không tìm thấy FAQ nào</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <div key={faq.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-full mt-1">
                      <HelpCircle className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-main mb-2">{faq.question}</h3>
                      <p className="text-text-muted whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditFAQ(faq)}
                    className="p-2 text-primary hover:bg-primary-50 rounded-button transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(faq)}
                    className="p-2 text-status-error hover:bg-red-50 rounded-button transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAQ Form Modal */}
      <FAQFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        faq={selectedFAQ}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa FAQ"
        message={`Bạn có chắc chắn muốn xóa câu hỏi "${selectedFAQ?.question}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FAQs;

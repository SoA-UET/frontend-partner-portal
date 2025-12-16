import React, { useState, useEffect } from 'react';
import Modal from '@/components/Common/Modal';
import { FAQ, FAQFormData } from '@/types/knowledge.types';

interface FAQFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FAQFormData) => Promise<void>;
  faq?: FAQ | null;
  mode: 'create' | 'edit';
}

const FAQFormModal: React.FC<FAQFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  faq,
  mode,
}) => {
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (faq && mode === 'edit') {
      setFormData({
        question: faq.question,
        answer: faq.answer,
      });
    } else {
      setFormData({
        question: '',
        answer: '',
      });
    }
    setErrors({});
  }, [faq, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.question.trim()) {
      newErrors.question = 'Vui lòng nhập câu hỏi';
    }
    if (!formData.answer.trim()) {
      newErrors.answer = 'Vui lòng nhập câu trả lời';
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

  const handleChange = (field: keyof FAQFormData, value: string) => {
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
      title={mode === 'create' ? 'Thêm câu hỏi thường gặp' : 'Chỉnh sửa câu hỏi thường gặp'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-button">
            <p className="text-sm text-status-error">{errors.general}</p>
          </div>
        )}

        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Câu hỏi <span className="text-status-error">*</span>
          </label>
          <textarea
            value={formData.question}
            onChange={(e) => handleChange('question', e.target.value)}
            className={`input ${errors.question ? 'border-status-error' : ''}`}
            rows={3}
            placeholder="Nhập câu hỏi thường gặp..."
            disabled={isLoading}
          />
          {errors.question && (
            <p className="text-xs text-status-error mt-1">{errors.question}</p>
          )}
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            Câu trả lời <span className="text-status-error">*</span>
          </label>
          <textarea
            value={formData.answer}
            onChange={(e) => handleChange('answer', e.target.value)}
            className={`input ${errors.answer ? 'border-status-error' : ''}`}
            rows={5}
            placeholder="Nhập câu trả lời..."
            disabled={isLoading}
          />
          {errors.answer && (
            <p className="text-xs text-status-error mt-1">{errors.answer}</p>
          )}
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
            {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Thêm FAQ' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FAQFormModal;

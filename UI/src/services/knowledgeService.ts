import { knowledgeClient } from './apiClient';
import {
  Package,
  PackageFormData,
  FAQ,
  FAQFormData,
  FileImport,
  FileImportDetail,
  ApiResponse,
  FileImportUploadResponse,
} from '@/types/knowledge.types';

class KnowledgeService {
  private readonly BASE_URL = '/api/v1/local-knowledge';

  // ==================== Packages APIs ====================
  
  /**
   * GET /api/v1/local-knowledge/packages
   * Get all packages
   */
  async getPackages(): Promise<Package[]> {
    const response = await knowledgeClient.get<ApiResponse<Package[]>>(`${this.BASE_URL}/packages`);
    return response.data.content;
  }

  /**
   * POST /api/v1/local-knowledge/packages
   * TP-07: Create new package
   */
  async createPackage(data: PackageFormData): Promise<Package> {
    const response = await knowledgeClient.post<ApiResponse<Package>>(`${this.BASE_URL}/packages`, data);
    return response.data.content;
  }

  /**
   * PATCH /api/v1/local-knowledge/packages/{id}
   * TP-08: Update package
   */
  async updatePackage(id: string, data: Partial<PackageFormData>): Promise<Package> {
    const response = await knowledgeClient.patch<ApiResponse<Package>>(`${this.BASE_URL}/packages/${id}`, data);
    return response.data.content;
  }

  /**
   * DELETE /api/v1/local-knowledge/packages/{id}
   * TP-09: Delete package
   */
  async deletePackage(id: string): Promise<void> {
    await knowledgeClient.delete(`${this.BASE_URL}/packages/${id}`);
  }

  // ==================== FAQs APIs ====================
  
  /**
   * GET /api/v1/local-knowledge/faqs
   * Get all FAQs
   */
  async getFAQs(): Promise<FAQ[]> {
    const response = await knowledgeClient.get<ApiResponse<FAQ[]>>(`${this.BASE_URL}/faqs`);
    return response.data.content;
  }

  /**
   * POST /api/v1/local-knowledge/faqs
   * TP-10: Create new FAQ
   */
  async createFAQ(data: FAQFormData): Promise<FAQ> {
    const response = await knowledgeClient.post<ApiResponse<FAQ>>(`${this.BASE_URL}/faqs`, data);
    return response.data.content;
  }

  /**
   * PATCH /api/v1/local-knowledge/faqs/{id}
   * TP-11: Update FAQ
   */
  async updateFAQ(id: string, data: Partial<FAQFormData>): Promise<FAQ> {
    const response = await knowledgeClient.patch<ApiResponse<FAQ>>(`${this.BASE_URL}/faqs/${id}`, data);
    return response.data.content;
  }

  /**
   * DELETE /api/v1/local-knowledge/faqs/{id}
   * TP-12: Delete FAQ
   */
  async deleteFAQ(id: string): Promise<void> {
    await knowledgeClient.delete(`${this.BASE_URL}/faqs/${id}`);
  }

  // ==================== File Imports APIs ====================
  
  /**
   * GET /api/v1/local-knowledge/file-imports
   * TP-13b: Get list of file imports
   */
  async getFileImports(): Promise<FileImport[]> {
    const response = await knowledgeClient.get<ApiResponse<FileImport[]>>(`${this.BASE_URL}/file-imports`);
    return response.data.content;
  }

  /**
   * GET /api/v1/local-knowledge/file-imports/{id}
   * TP-13c: Get file import detail
   */
  async getFileImportDetail(id: string): Promise<FileImportDetail> {
    const response = await knowledgeClient.get<ApiResponse<FileImportDetail>>(`${this.BASE_URL}/file-imports/${id}`);
    return response.data.content;
  }

  /**
   * POST /api/v1/local-knowledge/file-imports
   * TP-13a: Upload file for import
   */
  async uploadFileImport(file: File): Promise<FileImportUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify({ file_name: file.name }));

    const response = await knowledgeClient.post<ApiResponse<FileImportUploadResponse>>(
      `${this.BASE_URL}/file-imports`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.content;
  }

  /**
   * PATCH /api/v1/local-knowledge/file-imports/{id}/packages
   * TP-13d: Edit extracted packages from file import
   */
  async updateFileImportPackages(id: string, packages: Omit<Package, 'id'>[]): Promise<void> {
    await knowledgeClient.patch(`${this.BASE_URL}/file-imports/${id}/packages`, { packages });
  }

  /**
   * POST /api/v1/local-knowledge/file-imports/{id}/approve
   * TP-13e: Approve file import
   */
  async approveFileImport(id: string): Promise<void> {
    await knowledgeClient.post(`${this.BASE_URL}/file-imports/${id}/approve`);
  }

  /**
   * POST /api/v1/local-knowledge/file-imports/{id}/reject
   * TP-13f: Reject file import
   */
  async rejectFileImport(id: string): Promise<void> {
    await knowledgeClient.post(`${this.BASE_URL}/file-imports/${id}/reject`);
  }
}

export default new KnowledgeService();

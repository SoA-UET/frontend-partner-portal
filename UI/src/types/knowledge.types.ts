export interface Package {
  id: string;
  'Mã dịch vụ': string;
  'Thời gian thanh toán': string;
  'Các dịch vụ tiên quyết': string;
  'Giá (VNĐ)': number;
  'Chu kỳ (ngày)': number;
  '4G tốc độ tiêu chuẩn/ngày': number;
  '4G tốc độ cao/ngày': number;
  '4G tốc độ tiêu chuẩn/chu kỳ': number;
  '4G tốc độ cao/chu kỳ': number;
  'Gọi nội mạng': string;
  'Gọi ngoại mạng': string;
  'Tin nhắn': string;
  'Chi tiết': string;
  'Tự động gia hạn': string;
  'Cú pháp đăng ký': string;
}

export interface PackageFormData {
  'Mã dịch vụ': string;
  'Thời gian thanh toán': string;
  'Các dịch vụ tiên quyết': string;
  'Giá (VNĐ)': number;
  'Chu kỳ (ngày)': number;
  '4G tốc độ tiêu chuẩn/ngày': number;
  '4G tốc độ cao/ngày': number;
  '4G tốc độ tiêu chuẩn/chu kỳ': number;
  '4G tốc độ cao/chu kỳ': number;
  'Gọi nội mạng': string;
  'Gọi ngoại mạng': string;
  'Tin nhắn': string;
  'Chi tiết': string;
  'Tự động gia hạn': string;
  'Cú pháp đăng ký': string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FAQFormData {
  question: string;
  answer: string;
}

export interface FileImport {
  id: string;
  file_name: string;
  status: 'PENDING' | 'EXTRACTED' | 'FAILED' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export interface FileImportDetail extends FileImport {
  error_message?: string;
  packages: Omit<Package, 'id'>[];
}

export interface ApiResponse<T> {
  content: T;
}

export interface FileImportUploadResponse {
  id: string;
  message: string;
}

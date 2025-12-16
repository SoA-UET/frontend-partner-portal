export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  partner_employee: PartnerEmployee;
}

export interface PartnerEmployee {
  employee_id: string;
  full_name: string;
  role: string;
  status: string;
}

export interface AuthError {
  status: string;
  error_code: string;
  message: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: PartnerEmployee | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

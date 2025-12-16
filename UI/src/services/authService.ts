import apiClient from './apiClient';
import { LoginRequest, LoginResponse, PartnerEmployee } from '@/types/auth.types';

class AuthService {
  private readonly AUTH_BASE = '/api/v1/partner-auth';
  
  /**
   * H27 Endpoint 1: POST /api/v1/partner-auth/login
   * TP-01: Partner Login
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const request: LoginRequest = { username, password };
    const response = await apiClient.post<LoginResponse>(
      `${this.AUTH_BASE}/login`,
      request
    );
    
    // Store token and user info in localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.partner_employee));
    }
    
    return response.data;
  }

  /**
   * Logout - Clear local storage and redirect to login
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): PartnerEmployee | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as PartnerEmployee;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Get current token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'PARTNER_ADMIN';
  }
}

export default new AuthService();

import apiClient from './apiClient';
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeResponse,
  EmployeesListResponse,
  EmployeeDetailResponse,
} from '@/types/employee.types';

class EmployeeService {
  private readonly EMPLOYEE_BASE = '/api/v1/partner-employees';
  
  /**
   * H27 Endpoint 2: GET /api/v1/partner-employees
   * TP-05: Get All Partner Employees
   */
  async getEmployees(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<EmployeesListResponse> {
    const response = await apiClient.get<EmployeesListResponse>(
      this.EMPLOYEE_BASE,
      { params }
    );
    return response.data;
  }

  /**
   * H27 Endpoint 3: GET /api/v1/partner-employees/{employee_id}
   * TP-06: Get Partner Employee Detail
   */
  async getEmployee(employeeId: string): Promise<EmployeeDetailResponse> {
    const response = await apiClient.get<EmployeeDetailResponse>(
      `${this.EMPLOYEE_BASE}/${employeeId}`
    );
    return response.data;
  }

  /**
   * H27 Endpoint 4: POST /api/v1/partner-employees
   * TP-02: Add Partner Employee Account
   */
  async createEmployee(data: CreateEmployeeRequest): Promise<EmployeeResponse> {
    const response = await apiClient.post<EmployeeResponse>(
      this.EMPLOYEE_BASE,
      data
    );
    return response.data;
  }

  /**
   * H27 Endpoint 5: PUT /api/v1/partner-employees/{employee_id}
   * TP-03: Update Partner Employee Account
   */
  async updateEmployee(
    employeeId: string,
    data: UpdateEmployeeRequest
  ): Promise<EmployeeResponse> {
    const response = await apiClient.put<EmployeeResponse>(
      `${this.EMPLOYEE_BASE}/${employeeId}`,
      data
    );
    return response.data;
  }

  /**
   * H27 Endpoint 6: DELETE /api/v1/partner-employees/{employee_id}
   * TP-04: Delete/Disable Partner Employee Account
   */
  async deleteEmployee(employeeId: string, lockOnly: boolean = false): Promise<EmployeeResponse> {
    const response = await apiClient.delete<EmployeeResponse>(
      `${this.EMPLOYEE_BASE}/${employeeId}`,
      {
        params: { lock_only: lockOnly },
      }
    );
    return response.data;
  }
}

export default new EmployeeService();

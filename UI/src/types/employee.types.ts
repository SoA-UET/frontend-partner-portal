export interface Employee {
  _id: string;
  full_name: string;
  email: string;
  role_id: string;
  role_name?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  failed_login_attempts?: number;
  locked_until?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeDetail extends Omit<Employee, 'role_id' | 'role_name'> {
  role: Role;
}

export interface CreateEmployeeRequest {
  full_name: string;
  email: string;
  role_id: string;
}

export interface UpdateEmployeeRequest {
  full_name?: string;
  role_id?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
}

export interface EmployeeResponse {
  status: string;
  message: string;
  employee_id?: string;
}

export interface EmployeesListResponse {
  status: string;
  data: {
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface EmployeeDetailResponse {
  status: string;
  employee: EmployeeDetail;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

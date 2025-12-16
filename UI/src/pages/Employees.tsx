import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Edit, Trash2, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Employee, Role, CreateEmployeeRequest, UpdateEmployeeRequest } from '@/types/employee.types';
import employeeService from '@/services/employeeService';
import EmployeeFormModal from '@/components/Employees/EmployeeFormModal';
import ConfirmDialog from '@/components/Common/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';

// Mock roles - Thay thế bằng API khi có
const MOCK_ROLES: Role[] = [
  { id: '693e71e316f2061afc669347', name: 'Partner Admin', permissions: ['employee:write', 'employee:read', 'admin:manage', 'employee:delete', 'consult_text', 'consult_audio'] },
  { id: '693e71e316f2061afc669348', name: 'Partner Staff', permissions: ['consult_audio', 'consult_text'] },
];

const Employees: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles] = useState<Role[]>(MOCK_ROLES);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'delete' | 'lock'>('delete');
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check if user is admin
  const isAdmin = user?.role === 'PARTNER_ADMIN';

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getEmployees();
        setEmployees(response.data.employees);
      } catch (error) {
        showToast('Không thể tải danh sách nhân viên', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // TP-02: Add Employee
  const handleAddEmployee = () => {
    setFormMode('create');
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  // TP-03: Edit Employee
  const handleEditEmployee = (employee: Employee) => {
    setFormMode('edit');
    setSelectedEmployee(employee);
    setIsFormModalOpen(true);
  };

  // TP-04: Delete/Lock Employee
  const handleDeleteClick = (employee: Employee, lockOnly: boolean = false) => {
    setSelectedEmployee(employee);
    setDeleteMode(lockOnly ? 'lock' : 'delete');
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(true);
    try {
      await employeeService.deleteEmployee(
        selectedEmployee._id,
        deleteMode === 'lock'
      );
      // Cập nhật trạng thái trong list
      if (deleteMode === 'lock') {
        setEmployees(employees.map(emp =>
          emp._id === selectedEmployee._id
            ? { ...emp, status: 'LOCKED' as const }
            : emp
        ));
      } else {
        setEmployees(employees.map(emp =>
          emp._id === selectedEmployee._id
            ? { ...emp, status: 'INACTIVE' as const }
            : emp
        ));
      }
      showToast(
        deleteMode === 'lock'
          ? 'Tài khoản đã bị khóa tạm thời'
          : 'Tài khoản đã bị vô hiệu hóa',
        'success'
      );
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('Không thể xóa tài khoản. Vui lòng thử lại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: CreateEmployeeRequest | UpdateEmployeeRequest) => {
    try {
      if (formMode === 'create') {
        await employeeService.createEmployee(data as CreateEmployeeRequest);
        // Refresh the list after creation
        const listResponse = await employeeService.getEmployees();
        setEmployees(listResponse.data.employees);
        showToast('Tạo tài khoản nhân viên thành công và đã gửi email kích hoạt', 'success');
      } else if (selectedEmployee) {
        await employeeService.updateEmployee(
          selectedEmployee._id,
          data as UpdateEmployeeRequest
        );
        // Refresh the list after update
        const listResponse = await employeeService.getEmployees();
        setEmployees(listResponse.data.employees);
        showToast('Cập nhật tài khoản nhân viên thành công', 'success');
      }
      setIsFormModalOpen(false);
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  // Filter employees by search term
  const filteredEmployees = employees.filter((emp) =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { className: 'badge-success', icon: CheckCircle, text: 'Hoạt động' },
      INACTIVE: { className: 'badge-error', icon: XCircle, text: 'Không hoạt động' },
      LOCKED: { className: 'badge-warning', icon: Lock, text: 'Bị khóa' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <span className={`badge ${config.className} flex items-center gap-1`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  // Get role name
  const getRoleName = (roleId: string): string => {
    const role = roles.find((r) => r.id === roleId);
    return role?.name || 'N/A';
  };

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
              toast.type === 'success'
                ? 'bg-status-success text-white'
                : 'bg-status-error text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Quản lý tài khoản nhân viên</h1>
          <p className="text-meta mt-1">Quản lý tài khoản và quyền hạn nhân viên Partner</p>
        </div>
        {isAdmin && (
          <button onClick={handleAddEmployee} className="btn btn-primary">
            <UserPlus size={18} />
            Thêm mới
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-main uppercase tracking-wider">
                  Trạng thái
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-right text-xs font-semibold text-text-main uppercase tracking-wider">
                    Thao tác
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center">
                    <p className="text-text-muted">Không tìm thấy nhân viên nào</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      #{employee._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-main">
                        {employee.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-muted">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-info">
                        {employee.role_name || getRoleName(employee.role_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee.status)}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="p-2 text-primary hover:bg-primary-50 rounded-button transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(employee, true)}
                            className="p-2 text-status-warning hover:bg-yellow-50 rounded-button transition-colors"
                            title="Khóa tạm thời"
                          >
                            <Lock size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(employee, false)}
                            className="p-2 text-status-error hover:bg-red-50 rounded-button transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        employee={selectedEmployee}
        roles={roles}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deleteMode === 'lock' ? 'Khóa tài khoản?' : 'Xóa tài khoản?'}
        message={
          deleteMode === 'lock'
            ? `Bạn có chắc chắn muốn khóa tạm thời tài khoản "${selectedEmployee?.full_name}"?`
            : `Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${selectedEmployee?.full_name}"? Hành động này không thể hoàn tác.`
        }
        confirmText={deleteMode === 'lock' ? 'Khóa' : 'Xóa'}
        type={deleteMode === 'lock' ? 'warning' : 'danger'}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Employees;

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Quản lý nhân viên', path: '/employees' },
    { icon: MessageSquare, label: 'Tư vấn', path: '/consultations' },
    { icon: FileText, label: 'Cơ sở tri thức', path: '/knowledge' },
    { icon: BarChart3, label: 'Thống kê', path: '/metrics' },
    { icon: Settings, label: 'Cài đặt', path: '/settings' },
    { icon: HelpCircle, label: 'Trợ giúp', path: '/help' },
  ];

  return (
    <aside className="sidebar z-10">
      {/* Logo/Brand */}
      <div className="px-6 py-6 border-b border-primary-700">
        <h1 className="text-xl font-bold text-white">TelCenter</h1>
        <p className="text-xs text-primary-200 mt-1">Partner Portal</p>
      </div>

      {/* Navigation Menu */}
      <nav className="py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer/Version Info */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-primary-700">
        <p className="text-xs text-primary-300">Version 1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;

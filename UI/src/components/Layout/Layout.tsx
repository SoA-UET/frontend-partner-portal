import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Fixed Left */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '260px' }}>
        {/* Top Bar */}
        <TopBar />
        
        {/* Content Area with padding and scroll */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

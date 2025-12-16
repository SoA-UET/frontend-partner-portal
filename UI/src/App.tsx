import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import PartnerSettings from './pages/PartnerSettings';
import CoreConnection from './pages/CoreConnection';
import Packages from './pages/Packages';
import FAQs from './pages/FAQs';
import FileImports from './pages/FileImports';
import FileImportDetail from './pages/FileImportDetail';
import Updates from './pages/Updates';
import Metrics from './pages/Metrics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="packages" element={<Packages />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="file-imports" element={<FileImports />} />
              <Route path="file-imports/:id" element={<FileImportDetail />} />
              <Route path="updates" element={<Updates />} />
              <Route path="metrics" element={<Metrics />} />
              <Route path="partner-settings" element={<PartnerSettings />} />
              <Route path="core-connection" element={<CoreConnection />} />
              {/* Add more protected routes here */}
            </Route>
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

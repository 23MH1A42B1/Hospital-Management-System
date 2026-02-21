import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastProvider } from './components/Toast';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import PatientLayout from './layouts/PatientLayout';
import StaffLayout from './layouts/StaffLayout';

// Auth
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import PatientManagement from './pages/admin/PatientManagement';
import StaffManagement from './pages/admin/StaffManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import BillingManagement from './pages/admin/BillingManagement';
import Reports from './pages/admin/Reports';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AppointmentRequests from './pages/doctor/AppointmentRequests';
import PatientRecords from './pages/doctor/PatientRecords';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import RequestAppointment from './pages/patient/RequestAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import BillingHistory from './pages/patient/BillingHistory';
import PatientNotifications from './pages/patient/PatientNotifications';

// Staff pages
import ReceptionistDashboard from './pages/staff/ReceptionistDashboard';
import NurseDashboard from './pages/staff/NurseDashboard';
import PharmacistDashboard from './pages/staff/PharmacistDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) return <Navigate to="/login" replace />;
  return children;
}

function RoleRedirect() {
  const { currentUser, isAuthenticated } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const map = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard', receptionist: '/receptionist/dashboard', nurse: '/nurse/dashboard', pharmacist: '/pharmacist/dashboard' };
  return <Navigate to={map[currentUser?.role] || '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RoleRedirect />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<PatientManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="billing" element={<BillingManagement />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Doctor */}
          <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<AppointmentRequests />} />
            <Route path="patients" element={<PatientRecords />} />
          </Route>

          {/* Patient */}
          <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="request-appointment" element={<RequestAppointment />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="medical-records" element={<MedicalRecords />} />
            <Route path="billing" element={<BillingHistory />} />
            <Route path="notifications" element={<PatientNotifications />} />
          </Route>

          {/* Receptionist */}
          <Route path="/receptionist" element={<ProtectedRoute allowedRoles={['receptionist']}><StaffLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ReceptionistDashboard />} />
            <Route path="appointments" element={<ReceptionistDashboard />} />
            <Route path="patients" element={<PatientManagement />} />
          </Route>

          {/* Nurse */}
          <Route path="/nurse" element={<ProtectedRoute allowedRoles={['nurse']}><StaffLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<NurseDashboard />} />
            <Route path="patients" element={<PatientManagement />} />
          </Route>

          {/* Pharmacist */}
          <Route path="/pharmacist" element={<ProtectedRoute allowedRoles={['pharmacist']}><StaffLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PharmacistDashboard />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="prescriptions" element={<PharmacistDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

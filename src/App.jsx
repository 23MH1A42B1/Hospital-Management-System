import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastProvider } from './components/Toast';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import PatientLayout from './layouts/PatientLayout';
import StaffLayout from './layouts/StaffLayout';

// Profile Settings
import ProfileSettings from './pages/profile/ProfileSettings';

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
import WritePrescription from './pages/doctor/WritePrescription';
import LabOrders from './pages/doctor/LabOrders';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import RequestAppointment from './pages/patient/RequestAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import BillingHistory from './pages/patient/BillingHistory';
import PatientNotifications from './pages/patient/PatientNotifications';

// Staff — Shared dashboards
import ReceptionistDashboard from './pages/staff/ReceptionistDashboard';
import NurseDashboard from './pages/staff/NurseDashboard';
import PharmacistDashboard from './pages/staff/PharmacistDashboard';

// Receptionist pages
import PatientRegistration from './pages/staff/PatientRegistration';
import PatientCheckIn from './pages/staff/PatientCheckIn';
import BillingCounter from './pages/staff/BillingCounter';

// Nurse pages
import NursePatients from './pages/staff/nurse/NursePatients';
import VitalsRecording from './pages/staff/nurse/VitalsRecording';
import MedicationAdmin from './pages/staff/nurse/MedicationAdmin';
import NurseOrders from './pages/staff/nurse/NurseOrders';

// Pharmacist pages
import MedicineInventory from './pages/staff/pharmacy/MedicineInventory';
import PrescriptionQueue from './pages/staff/pharmacy/PrescriptionQueue';
import QuickSale from './pages/staff/pharmacy/QuickSale';
import PharmacyReports from './pages/staff/pharmacy/PharmacyReports';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) return <Navigate to="/login" replace />;
  return children;
}

function RoleRedirect() {
  const { currentUser, isAuthenticated } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const map = {
    admin: '/admin/dashboard',
    doctor: '/doctor/dashboard',
    patient: '/patient/dashboard',
    receptionist: '/receptionist/dashboard',
    nurse: '/nurse/dashboard',
    pharmacist: '/pharmacist/dashboard',
  };
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
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Doctor */}
          <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<AppointmentRequests />} />
            <Route path="patients" element={<PatientRecords />} />
            <Route path="prescriptions" element={<WritePrescription />} />
            <Route path="lab-orders" element={<LabOrders />} />
            <Route path="profile" element={<ProfileSettings />} />
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
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Receptionist */}
          <Route path="/receptionist" element={<ProtectedRoute allowedRoles={['receptionist']}><StaffLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ReceptionistDashboard />} />
            <Route path="register" element={<PatientRegistration />} />
            <Route path="checkin" element={<PatientCheckIn />} />
            <Route path="billing" element={<BillingCounter />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Nurse */}
          <Route path="/nurse" element={<ProtectedRoute allowedRoles={['nurse']}><StaffLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<NurseDashboard />} />
            <Route path="patients" element={<NursePatients />} />
            <Route path="patients/:patientId/vitals" element={<VitalsRecording />} />
            <Route path="medications" element={<MedicationAdmin />} />
            <Route path="orders" element={<NurseOrders />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Pharmacist */}
          <Route path="/pharmacist" element={<ProtectedRoute allowedRoles={['pharmacist']}><StaffLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PharmacistDashboard />} />
            <Route path="inventory" element={<MedicineInventory />} />
            <Route path="prescriptions" element={<PrescriptionQueue />} />
            <Route path="sale" element={<QuickSale />} />
            <Route path="reports" element={<PharmacyReports />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

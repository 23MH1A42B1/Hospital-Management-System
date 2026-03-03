import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, CalendarCheck, Users, LogOut, Hospital, FlaskConical, FilePen } from 'lucide-react';
import { logout } from '../slices/authSlice';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown from '../components/ProfileDropdown';

function getInitials(name) { return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'; }

export default function DoctorLayout() {
    const { currentUser } = useSelector(s => s.auth);
    const appointments = useSelector(s => s.appointments.list);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const pendingCount = appointments.filter(a =>
        a.doctorId === currentUser?.doctorId && a.status === 'pending'
    ).length;

    const navItems = [
        { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/doctor/appointments', label: 'Appointment Requests', icon: CalendarCheck, badge: pendingCount },
        { to: '/doctor/patients', label: 'Patient Records', icon: Users },
        { to: '/doctor/prescriptions', label: 'Write Prescription', icon: FilePen },
        { to: '/doctor/lab-orders', label: 'Lab Orders', icon: FlaskConical },
    ];

    return (
        <div className="app-shell">
            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon"><Hospital size={22} color="#fff" /></div>
                    <div className="sidebar-logo-text">
                        <h2>MediCare HMS</h2>
                        <span>Doctor Portal</span>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Doctor</div>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                                <Icon size={18} className="sidebar-item-icon" />
                                {item.label}
                                {item.badge > 0 && <span className="sidebar-item-badge">{item.badge}</span>}
                            </NavLink>
                        );
                    })}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-user px-3">
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{currentUser?.name}</div>
                            <div className="sidebar-user-role" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Doctor · {currentUser?.department}</div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">
                        <h1>Doctor Dashboard</h1>
                        <p>{currentUser?.name} · {currentUser?.department}</p>
                    </div>
                    <div className="topbar-actions">
                        <NotificationBell />
                        <ProfileDropdown />
                    </div>
                </header>
                <main className="page-content"><Outlet /></main>
            </div>
        </div>
    );
}

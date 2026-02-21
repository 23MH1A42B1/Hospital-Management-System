import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, CalendarPlus, Calendar, FileText, ReceiptText, Bell, LogOut, Hospital } from 'lucide-react';
import { logout } from '../slices/authSlice';
import NotificationBell from '../components/NotificationBell';

function getInitials(name) { return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'; }

export default function PatientLayout() {
    const { currentUser } = useSelector(s => s.auth);
    const notifications = useSelector(s => s.notifications.list.filter(n => n.userId === currentUser?.id && !n.read));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => { dispatch(logout()); navigate('/login'); };

    const navItems = [
        { to: '/patient/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        { to: '/patient/request-appointment', label: 'Book Appointment', icon: CalendarPlus },
        { to: '/patient/appointments', label: 'My Appointments', icon: Calendar },
        { to: '/patient/medical-records', label: 'Medical Records', icon: FileText },
        { to: '/patient/billing', label: 'Billing History', icon: ReceiptText },
        { to: '/patient/notifications', label: 'Notifications', icon: Bell, badge: notifications.length },
    ];

    return (
        <div className="app-shell">
            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon"><Hospital size={22} color="#fff" /></div>
                    <div className="sidebar-logo-text">
                        <h2>MediCare HMS</h2>
                        <span>Patient Portal</span>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Patient</div>
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
                    <div className="sidebar-user">
                        <div className="avatar avatar-purple">{getInitials(currentUser?.name)}</div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{currentUser?.name}</div>
                            <div className="sidebar-user-role">Patient</div>
                        </div>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">
                        <h1>Patient Portal</h1>
                        <p>Welcome back, {currentUser?.name?.split(' ')[0]}</p>
                    </div>
                    <div className="topbar-actions">
                        <NotificationBell />
                        <div className="avatar avatar-purple">{getInitials(currentUser?.name)}</div>
                    </div>
                </header>
                <main className="page-content"><Outlet /></main>
            </div>
        </div>
    );
}

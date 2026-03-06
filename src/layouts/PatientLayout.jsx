import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, CalendarPlus, Calendar, FileText, ReceiptText, Bell, LogOut, Hospital, Menu } from 'lucide-react';
import { logout } from '../slices/authSlice';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown from '../components/ProfileDropdown';

function getInitials(name) { return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'; }

export default function PatientLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { currentUser } = useSelector(s => s.auth);
    const notifications = useSelector(s => s.notifications.list.filter(n => n.userId === currentUser?.id && !n.read));
    const dispatch = useDispatch();
    const navigate = useNavigate();


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
            <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>

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
                    <div className="sidebar-user px-3">
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{currentUser?.name}</div>
                            <div className="sidebar-user-role" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Patient</div>
                        </div>
                    </div>
                </div>
            </aside>
            <div className="main-content">
                <header className="topbar">
                    <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <div className="topbar-title">
                        <h1>Patient Portal</h1>
                        <p>Welcome back, {currentUser?.name?.split(' ')[0]}</p>
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

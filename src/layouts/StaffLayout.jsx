import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, LogOut, Hospital, Package, ClipboardList, ShoppingCart, BarChart2, Pill, UserPlus, UserCheck, Receipt, Activity, Heart, FlaskConical, Menu } from 'lucide-react';
import { logout } from '../slices/authSlice';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown from '../components/ProfileDropdown';

function getInitials(name) { return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'; }

const roleNavItems = {
    receptionist: [
        { to: '/receptionist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/receptionist/register', label: 'Register Patient', icon: UserPlus },
        { to: '/receptionist/checkin', label: 'Patient Check-In', icon: UserCheck },
        { to: '/receptionist/billing', label: 'Billing Counter', icon: Receipt },
    ],
    nurse: [
        { to: '/nurse/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/nurse/patients', label: 'My Patients', icon: Heart },
        { to: '/nurse/medications', label: 'Medication Admin (MAR)', icon: Pill },
        { to: '/nurse/orders', label: 'Nurse Orders', icon: ClipboardList },
    ],
    pharmacist: [
        { to: '/pharmacist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/pharmacist/inventory', label: 'Medicine Inventory', icon: Pill },
        { to: '/pharmacist/prescriptions', label: 'Prescriptions', icon: ClipboardList },
        { to: '/pharmacist/sale', label: 'Quick Sale', icon: ShoppingCart },
        { to: '/pharmacist/reports', label: 'Reports', icon: BarChart2 },
    ],
};

const roleColors = { receptionist: 'avatar-orange', nurse: 'avatar-green', pharmacist: 'avatar-red' };
const roleTitles = { receptionist: 'Receptionist Portal', nurse: 'Nurse Portal', pharmacist: 'Pharmacist Portal' };

export default function StaffLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { currentUser } = useSelector(s => s.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const role = currentUser?.role;


    const navItems = roleNavItems[role] || [];
    const avatarClass = roleColors[role] || 'avatar-blue';

    return (
        <div className="app-shell">
            <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>

                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon"><Hospital size={22} color="#fff" /></div>
                    <div className="sidebar-logo-text">
                        <h2>MediCare HMS</h2>
                        <span>{roleTitles[role] || 'Staff Portal'}</span>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">{role}</div>
                    {navItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <NavLink key={i} to={item.to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                                <Icon size={18} className="sidebar-item-icon" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-user px-3">
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{currentUser?.name}</div>
                            <div className="sidebar-user-role" style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'capitalize' }}>{role}</div>
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
                        <h1>{roleTitles[role] || 'Staff Portal'}</h1>
                        <p>Welcome, {currentUser?.name}</p>
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

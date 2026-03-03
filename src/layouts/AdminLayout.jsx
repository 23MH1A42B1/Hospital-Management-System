import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    LayoutDashboard, Users, Package, CreditCard, BarChart3,
    UserCog, LogOut, Hospital
} from 'lucide-react';
import { logout } from '../slices/authSlice';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown from '../components/ProfileDropdown';

const navItems = [
    {
        label: 'Overview', items: [
            { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ]
    },
    {
        label: 'Management', items: [
            { to: '/admin/patients', label: 'Patients', icon: Users },
            { to: '/admin/staff', label: 'Staff', icon: UserCog },
            { to: '/admin/inventory', label: 'Inventory', icon: Package },
        ]
    },
    {
        label: 'Finance', items: [
            { to: '/admin/billing', label: 'Billing', icon: CreditCard },
            { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
        ]
    },
];

function getInitials(name) { return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'; }

export default function AdminLayout() {
    const { currentUser } = useSelector(s => s.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();



    return (
        <div className="app-shell">
            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon"><Hospital size={22} color="#fff" /></div>
                    <div className="sidebar-logo-text">
                        <h2>MediCare HMS</h2>
                        <span>Hospital Management</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(section => (
                        <div key={section.label}>
                            <div className="sidebar-section-label">{section.label}</div>
                            {section.items.map(item => {
                                const Icon = item.icon;
                                return (
                                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                                        <Icon size={18} className="sidebar-item-icon" />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user px-3">
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{currentUser?.name}</div>
                            <div className="sidebar-user-role" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Administrator</div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-title">
                        <h1>MediCare Hospital Management</h1>
                        <p>Admin Portal · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="topbar-actions">
                        <NotificationBell />
                        <ProfileDropdown />
                    </div>
                </header>
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

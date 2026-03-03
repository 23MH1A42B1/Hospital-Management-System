import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Settings, Bell, Lock, Monitor, LogOut } from 'lucide-react';
import { logout } from '../slices/authSlice';

function getInitials(name) {
    return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
}

export default function ProfileDropdown({ avatarClass = 'avatar-blue' }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.auth);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path) => {
        setIsOpen(false);
        const basePath = `/${currentUser?.role}`;
        navigate(`${basePath}${path}`);
    };

    const handleLogout = () => {
        setIsOpen(false);
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="profile-dropdown-container" ref={dropdownRef}>
            <div
                className={`avatar ${avatarClass}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {getInitials(currentUser?.name)}
            </div>

            {isOpen && (
                <div className="profile-dropdown-menu panel">
                    <div className="profile-dropdown-header">
                        <div className={`avatar ${avatarClass}`}>{getInitials(currentUser?.name)}</div>
                        <div className="profile-dropdown-user-info">
                            <div className="profile-dropdown-name">{currentUser?.name}</div>
                            <div className="profile-dropdown-role" style={{ textTransform: 'capitalize' }}>
                                {currentUser?.role}
                            </div>
                        </div>
                    </div>

                    <div className="profile-dropdown-divider"></div>

                    <div className="profile-dropdown-items">
                        <button className="profile-dropdown-item" onClick={() => handleNavigate('/profile')}>
                            <User size={16} /> View Profile
                        </button>
                        <button className="profile-dropdown-item" onClick={() => handleNavigate('/profile?tab=settings')}>
                            <Settings size={16} /> Profile Settings
                        </button>
                        <button className="profile-dropdown-item" onClick={() => handleNavigate('/profile?tab=notifications')}>
                            <Bell size={16} /> Notification Preferences
                        </button>
                        <button className="profile-dropdown-item" onClick={() => handleNavigate('/profile?tab=security')}>
                            <Lock size={16} /> Change Password
                        </button>
                        <button className="profile-dropdown-item" onClick={() => handleNavigate('/profile?tab=display')}>
                            <Monitor size={16} /> Language & Display
                        </button>

                        <div className="profile-dropdown-divider"></div>

                        <button className="profile-dropdown-item text-danger" onClick={handleLogout}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

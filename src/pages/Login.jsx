import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, loginAsRole, clearError } from '../slices/authSlice';
import { Hospital, Eye, EyeOff, Shield, User, Stethoscope, ClipboardList, Pill, HeartPulse } from 'lucide-react';

const demoRoles = [
    { role: 'admin', label: 'Admin', icon: Shield, color: '#1a56db' },
    { role: 'doctor', label: 'Doctor', icon: Stethoscope, color: '#059669' },
    { role: 'patient', label: 'Patient', icon: User, color: '#7c3aed' },
    { role: 'receptionist', label: 'Receptionist', icon: ClipboardList, color: '#d97706' },
    { role: 'nurse', label: 'Nurse', icon: HeartPulse, color: '#0891b2' },
    { role: 'pharmacist', label: 'Pharmacist', icon: Pill, color: '#dc2626' },
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error } = useSelector(s => s.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(clearError());
        dispatch(login({ email, password }));
    };

    const handleRoleLogin = (role) => {
        dispatch(loginAsRole(role));
        navigate('/');
    };

    // Navigate if login succeeded (watch the error state)
    const { isAuthenticated } = useSelector(s => s.auth);
    if (isAuthenticated) { navigate('/'); return null; }

    return (
        <>
            {/* ⚠️ Fixed banner — does NOT affect the flex centering of login-page */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
                background: 'linear-gradient(90deg, #92400e, #b45309)',
                color: '#fef3c7', textAlign: 'center',
                padding: '9px 20px', fontSize: '0.82rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}>
                <span>⚠️</span>
                <span>
                    <strong>DEMO APPLICATION ONLY</strong> — Fictional data. Do <strong>not</strong> use for real medical decisions.
                </span>
                <span>🏥</span>
            </div>

            <div className="login-page">
                <div className="login-container">
                    <div className="login-left">
                        <div className="login-left-logo">
                            <div className="login-left-logo-icon"><Hospital size={26} color="#fff" /></div>
                            <div>
                                <h1>MediCare HMS</h1>
                                <span>Hospital Management System</span>
                            </div>
                        </div>
                        <div className="login-left-tagline">Complete Hospital Operations Management</div>
                        <div className="login-left-desc">Streamlining patient care, appointments, inventory, and billing in one unified platform.</div>
                        <div className="login-features">
                            {['Patient Management & Records', 'Appointment Approval Workflow', 'Real-time Notifications', 'Inventory & Billing Management', 'Analytics & Reports'].map(f => (
                                <div key={f} className="login-feature">
                                    <div className="login-feature-dot" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="login-right">
                        <h2>Welcome Back 👋</h2>
                        <p>Sign in to access your hospital management dashboard.</p>

                        {error && (
                            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#991b1b', fontSize: '0.875rem' }}>
                                ❌ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">Password</label>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ paddingRight: 42 }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: 12, bottom: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                                Sign In
                            </button>
                        </form>

                        <div className="demo-roles">
                            <h4>🚀 Quick Demo Login — Select a Role</h4>
                            <div className="demo-roles-grid">
                                {demoRoles.map(({ role, label, icon: Icon, color }) => (
                                    <button key={role} className="role-chip" onClick={() => handleRoleLogin(role)}>
                                        <Icon size={14} color={color} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


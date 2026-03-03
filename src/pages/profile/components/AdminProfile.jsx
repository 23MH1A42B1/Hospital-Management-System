import { useState } from 'react';
import { User, Bell, Lock, Monitor, Shield, Activity, LogOut } from 'lucide-react';

export default function AdminProfile({ activeTab, setActiveTab, setHasUnsavedChanges }) {
    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'professional', label: 'Professional Info', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'display', label: 'Display & Prefs', icon: Monitor },
        { id: 'activity', label: 'Activity Log', icon: Activity },
    ];

    const handleChange = () => setHasUnsavedChanges(true);

    return (
        <div className="profile-tabs-container">
            <div className="profile-tabs sidebar-style-tabs">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={18} /> <span className="tab-label">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="profile-tab-content panel">
                {activeTab === 'personal' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">📋 Personal Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input type="text" className="form-control" defaultValue="John" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" className="form-control" defaultValue="Anderson" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <div className="input-group">
                                    <input type="email" className="form-control" defaultValue="john.anderson@hospital.com" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <button className="btn-link mt-1 text-sm">Change Email</button>
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <div className="input-group">
                                    <input type="tel" className="form-control" defaultValue="+1-555-0100" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <button className="btn-link mt-1 text-sm">Change Phone</button>
                            </div>
                            <div className="form-group">
                                <label>Alternate Phone</label>
                                <input type="tel" className="form-control" defaultValue="+1-555-0101" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date" className="form-control" defaultValue="1980-06-15" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Gender</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="gender" defaultChecked onChange={handleChange} /> Male</label>
                                    <label><input type="radio" name="gender" onChange={handleChange} /> Female</label>
                                    <label><input type="radio" name="gender" onChange={handleChange} /> Other</label>
                                    <label><input type="radio" name="gender" onChange={handleChange} /> Prefer not to say</label>
                                </div>
                            </div>

                            <h4 className="mt-4 mb-2 full-width">Address</h4>
                            <div className="form-group full-width">
                                <label>Street</label>
                                <input type="text" className="form-control" defaultValue="456 Admin Lane" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" className="form-control" defaultValue="New York" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" className="form-control" defaultValue="NY" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Zip / Postal Code</label>
                                <input type="text" className="form-control" defaultValue="10001" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <select className="form-control" defaultValue="US" onChange={handleChange}>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'professional' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🏥 Professional Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Employee ID 🔒</label>
                                <input type="text" className="form-control" value="ADM-2024-001" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Designation 🔒</label>
                                <input type="text" className="form-control" value="System Administrator" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Department 🔒</label>
                                <input type="text" className="form-control" value="Administration" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Joining Date 🔒</label>
                                <input type="text" className="form-control" value="January 10, 2020" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Work Email</label>
                                <input type="email" className="form-control" defaultValue="admin@cityhospital.com" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Work Phone Extension</label>
                                <input type="text" className="form-control" defaultValue="Ext: 100" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Office Location</label>
                                <input type="text" className="form-control" defaultValue="Administrative Block, Room 101" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🔔 Notification Preferences</h3>

                        <h4 className="mt-2 mb-2">Email Notifications</h4>
                        <div className="checkbox-group mb-4">
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> System alerts and critical issues</label>
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> New staff registration requests</label>
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> Daily summary report</label>
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> Financial alerts</label>
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> Inventory alerts</label>
                            <label><input type="checkbox" onChange={handleChange} /> Marketing and updates</label>
                        </div>

                        <h4 className="mt-2 mb-2">SMS Notifications</h4>
                        <div className="checkbox-group mb-4">
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> Critical system alerts only</label>
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> Security alerts (login, password change)</label>
                            <label><input type="checkbox" onChange={handleChange} /> Daily reports via SMS</label>
                        </div>

                        <h4 className="mt-2 mb-2">In-App Notifications</h4>
                        <div className="checkbox-group mb-4">
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> All notifications</label>
                            <label><input type="checkbox" defaultChecked onChange={handleChange} /> Sound alerts for critical issues</label>
                        </div>

                        <div className="form-group mt-4">
                            <label>Notification Frequency</label>
                            <div className="radio-group">
                                <label><input type="radio" name="freq" defaultChecked onChange={handleChange} /> Real-time</label>
                                <label><input type="radio" name="freq" onChange={handleChange} /> Every 30 minutes digest</label>
                                <label><input type="radio" name="freq" onChange={handleChange} /> Hourly digest</label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🔒 Security Settings</h3>

                        <div className="form-grid mb-4 border-bottom pb-4">
                            <div className="form-group full-width">
                                <label>Current Password</label>
                                <input type="password" className="form-control" defaultValue="••••••••••••" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" className="form-control" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" className="form-control" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <div className="text-sm mb-1">Password Strength: <span className="text-success">Strong</span></div>
                                <div className="progress-bar-container w-1/2">
                                    <div className="progress-bar bg-success" style={{ width: '90%' }}></div>
                                </div>
                                <div className="password-reqs text-sm text-secondary mt-2">
                                    Password Requirements:
                                    <ul className="list-unstyled mt-1">
                                        <li><span className="text-success">✅</span> Minimum 8 characters</li>
                                        <li><span className="text-success">✅</span> At least one uppercase letter</li>
                                        <li><span className="text-success">✅</span> At least one number</li>
                                        <li><span className="text-success">✅</span> At least one special character</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 border-bottom pb-4">
                            <h4 className="mb-2">Two-Factor Authentication (2FA)</h4>
                            <div className="d-flex align-items-center mb-3">
                                <span>Status:</span>
                                <span className="status-badge status-active ml-2">🟢 Enabled</span>
                            </div>
                            <div className="form-group mb-3">
                                <label>Method</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="2fa" defaultChecked onChange={handleChange} /> Authenticator App</label>
                                    <label><input type="radio" name="2fa" onChange={handleChange} /> SMS</label>
                                    <label><input type="radio" name="2fa" onChange={handleChange} /> Email</label>
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-outline btn-sm text-danger mr-2">Disable 2FA</button>
                                <button className="btn btn-outline btn-sm">View Recovery Codes</button>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-3">Active Sessions</h4>
                            <div className="session-card active-session">
                                <div className="session-icon"><Monitor size={24} /></div>
                                <div className="session-details">
                                    <div className="session-device">Windows PC - Chrome</div>
                                    <div className="session-meta">IP: 192.168.1.1 | Current Session</div>
                                </div>
                            </div>
                            <div className="session-card mt-3">
                                <div className="session-icon">📱</div>
                                <div className="session-details">
                                    <div className="session-device">iPhone - Safari</div>
                                    <div className="session-meta">IP: 192.168.1.45 | Last: 2 hours ago</div>
                                </div>
                                <button className="btn btn-outline btn-sm btn-logout"><LogOut size={14} /> Logout</button>
                            </div>
                            <button className="btn btn-outline text-danger mt-4">Logout All Other Devices</button>
                        </div>
                    </div>
                )}

                {activeTab === 'display' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🌐 Display & Preferences</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Language</label>
                                <select className="form-control" defaultValue="en" onChange={handleChange}>
                                    <option value="en">English (US)</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Time Zone</label>
                                <select className="form-control" defaultValue="EST" onChange={handleChange}>
                                    <option value="EST">UTC-05:00 Eastern Time</option>
                                    <option value="CST">UTC-06:00 Central Time</option>
                                    <option value="MST">UTC-07:00 Mountain Time</option>
                                    <option value="PST">UTC-08:00 Pacific Time</option>
                                </select>
                            </div>
                            <div className="form-group full-width mt-3">
                                <label>Date Format</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="datefmt" defaultChecked onChange={handleChange} /> MM/DD/YYYY</label>
                                    <label><input type="radio" name="datefmt" onChange={handleChange} /> DD/MM/YYYY</label>
                                    <label><input type="radio" name="datefmt" onChange={handleChange} /> YYYY-MM-DD</label>
                                </div>
                            </div>
                            <div className="form-group full-width mt-3">
                                <label>Time Format</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="timefmt" defaultChecked onChange={handleChange} /> 12-hour (AM/PM)</label>
                                    <label><input type="radio" name="timefmt" onChange={handleChange} /> 24-hour</label>
                                </div>
                            </div>
                            <div className="form-group full-width mt-3">
                                <label>Theme</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="theme" defaultChecked onChange={handleChange} /> 🌞 Light Mode</label>
                                    <label><input type="radio" name="theme" onChange={handleChange} /> 🌙 Dark Mode</label>
                                    <label><input type="radio" name="theme" onChange={handleChange} /> 💻 System Default</label>
                                </div>
                            </div>
                            <div className="form-group full-width mt-3">
                                <label>Dashboard Layout</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="layout" defaultChecked onChange={handleChange} /> Compact</label>
                                    <label><input type="radio" name="layout" onChange={handleChange} /> Comfortable</label>
                                    <label><input type="radio" name="layout" onChange={handleChange} /> Spacious</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">📊 Activity Log</h3>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">✅</div>
                                <div className="activity-details">
                                    <div className="activity-title">Login</div>
                                    <div className="activity-time">March 15, 2024 08:30 AM</div>
                                    <div className="activity-meta">Device: Windows PC - Chrome</div>
                                </div>
                            </div>
                            <div className="activity-item mt-3">
                                <div className="activity-icon">✏️</div>
                                <div className="activity-details">
                                    <div className="activity-title">Updated staff record (EMP-2024-0145)</div>
                                    <div className="activity-time">March 14, 2024 03:45 PM</div>
                                </div>
                            </div>
                            <div className="activity-item mt-3">
                                <div className="activity-icon">💰</div>
                                <div className="activity-details">
                                    <div className="activity-title">Approved budget report</div>
                                    <div className="activity-time">March 14, 2024 02:15 PM</div>
                                </div>
                            </div>
                            <div className="activity-item mt-3">
                                <div className="activity-icon">🔒</div>
                                <div className="activity-details">
                                    <div className="activity-title">Password changed</div>
                                    <div className="activity-time">March 10, 2024 10:00 AM</div>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-outline mt-4">View Full Activity Log</button>
                    </div>
                )}
            </div>
        </div>
    );
}

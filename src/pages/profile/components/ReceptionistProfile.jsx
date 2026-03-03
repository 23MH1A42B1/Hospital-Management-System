import { useState } from 'react';
import { User, Briefcase, Bell, Lock, Monitor } from 'lucide-react';

export default function ReceptionistProfile({ activeTab, setActiveTab, setHasUnsavedChanges }) {
    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'professional', label: 'Professional Info', icon: Briefcase },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'display', label: 'Display & Prefs', icon: Monitor },
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
                                <input type="text" className="form-control" defaultValue="Lisa" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" className="form-control" defaultValue="Chen" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <div className="input-group">
                                    <input type="email" className="form-control" defaultValue="lisa.chen@hospital.com" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <button className="btn-link mt-1 text-sm">Change Email</button>
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <div className="input-group">
                                    <input type="tel" className="form-control" defaultValue="+1-555-0178" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <button className="btn-link mt-1 text-sm">Change Phone</button>
                            </div>
                            <div className="form-group">
                                <label>Work Extension</label>
                                <input type="text" className="form-control" defaultValue="Ext: 110" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date" className="form-control" defaultValue="1995-04-08" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Gender</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="gend" onChange={handleChange} /> Male</label>
                                    <label><input type="radio" name="gend" defaultChecked onChange={handleChange} /> Female</label>
                                    <label><input type="radio" name="gend" onChange={handleChange} /> Other</label>
                                </div>
                            </div>

                            <h4 className="mt-4 mb-2 full-width">Home Address</h4>
                            <div className="form-group full-width">
                                <label>Street</label>
                                <input type="text" className="form-control" defaultValue="321 Maple Street" onChange={handleChange} />
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
                                <label>Zip</label>
                                <input type="text" className="form-control" defaultValue="10005" onChange={handleChange} />
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
                                <input type="text" className="form-control" value="EMP-2024-0201" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Role 🔒</label>
                                <input type="text" className="form-control" value="Front Desk Receptionist" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Department 🔒</label>
                                <input type="text" className="form-control" value="Front Desk / Administration" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Shift Timing 🔒</label>
                                <input type="text" className="form-control" value="Morning: 7:00 AM - 3:00 PM" readOnly disabled />
                                <div className="text-secondary text-sm mt-1">(Admin managed)</div>
                            </div>
                            <div className="form-group">
                                <label>Counter/Desk Number</label>
                                <input type="text" className="form-control" defaultValue="Counter 2" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Joining Date 🔒</label>
                                <input type="text" className="form-control" value="June 15, 2022" readOnly disabled />
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Skills & Certifications</label>
                                <div className="checkbox-group row-style">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Patient Registration</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Appointment Scheduling</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Billing & Payments</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Insurance Processing</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> First Aid Certified</label>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Languages Spoken</label>
                                <div className="checkbox-group row-style">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> English</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Mandarin Chinese</label>
                                    <label><input type="checkbox" onChange={handleChange} /> Spanish</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🔔 Notification Preferences</h3>
                        <div className="form-grid">
                            <div className="form-group full-width mb-4">
                                <h4>Work Notifications</h4>
                                <div className="checkbox-group">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> New patient registration alerts</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Appointment check-in reminders</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Doctor running late alerts</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Queue status updates</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Payment pending reminders</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Shift start/end reminders</label>
                                </div>
                            </div>
                            <div className="form-group full-width mb-4">
                                <h4>SMS Notifications</h4>
                                <div className="checkbox-group">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Emergency alerts only</label>
                                    <label><input type="checkbox" onChange={handleChange} /> All appointment updates via SMS</label>
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <h4>Notification Sound</h4>
                                <div className="radio-group py-2">
                                    <label><input type="radio" name="snd" defaultChecked onChange={handleChange} /> Sound On</label>
                                    <label><input type="radio" name="snd" onChange={handleChange} /> Silent</label>
                                    <label><input type="radio" name="snd" onChange={handleChange} /> Vibrate Only</label>
                                </div>
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
                                <button className="btn btn-outline" onChange={handleChange}>Update Password</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'display' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🌐 Display & Work Preferences</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Language</label>
                                <select className="form-control" defaultValue="en" onChange={handleChange}>
                                    <option value="en">English (US)</option>
                                </select>
                            </div>
                            <div className="form-group full-width mt-2">
                                <label>Theme</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="themeR" defaultChecked onChange={handleChange} /> 🌞 Light Mode</label>
                                    <label><input type="radio" name="themeR" onChange={handleChange} /> 🌙 Dark Mode</label>
                                </div>
                            </div>
                            <div className="form-group full-width mt-4">
                                <label>Default View on Login</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="vR" defaultChecked onChange={handleChange} /> Today's Appointments</label>
                                    <label><input type="radio" name="vR" onChange={handleChange} /> Patient Registration</label>
                                    <label><input type="radio" name="vR" onChange={handleChange} /> Check-in Dashboard</label>
                                </div>
                            </div>
                            <div className="form-group full-width mt-4">
                                <label>Quick Action Shortcuts</label>
                                <div className="checkbox-group row-style">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Show quick register button</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Show check-in button</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Show billing shortcut</label>
                                </div>
                            </div>
                            <div className="form-group full-width mt-4">
                                <label>Auto-fill Patient Details (faster registration)</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="af" defaultChecked onChange={handleChange} /> Enabled</label>
                                    <label><input type="radio" name="af" onChange={handleChange} /> Disabled</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

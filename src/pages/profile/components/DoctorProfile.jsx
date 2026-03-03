import { useState } from 'react';
import { User, Bell, Lock, Monitor, Briefcase, CalendarClock, Trash2, Plus } from 'lucide-react';

export default function DoctorProfile({ activeTab, setActiveTab, setHasUnsavedChanges }) {
    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'professional', label: 'Professional', icon: Briefcase },
        { id: 'schedule', label: 'Schedule', icon: CalendarClock },
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
                                <input type="text" className="form-control" defaultValue="Sarah" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" className="form-control" defaultValue="Johnson" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <div className="input-group">
                                    <input type="email" className="form-control" defaultValue="sarah.johnson@hospital.com" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <button className="btn-link mt-1 text-sm">Change Email</button>
                            </div>
                            <div className="form-group">
                                <label>Personal Phone *</label>
                                <div className="input-group">
                                    <input type="tel" className="form-control" defaultValue="+1-555-0156" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <button className="btn-link mt-1 text-sm">Change Phone</button>
                            </div>
                            <div className="form-group">
                                <label>Work Phone</label>
                                <input type="tel" className="form-control" defaultValue="+1-555-0200" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Work Extension</label>
                                <input type="text" className="form-control" defaultValue="Ext: 205" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date" className="form-control" defaultValue="1982-09-22" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Gender</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="gender" onChange={handleChange} /> Male</label>
                                    <label><input type="radio" name="gender" defaultChecked onChange={handleChange} /> Female</label>
                                    <label><input type="radio" name="gender" onChange={handleChange} /> Other</label>
                                </div>
                            </div>

                            <h4 className="mt-4 mb-2 full-width">Home Address</h4>
                            <div className="form-group full-width">
                                <label>Street</label>
                                <input type="text" className="form-control" defaultValue="789 Doctor's Avenue" onChange={handleChange} />
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
                                <input type="text" className="form-control" defaultValue="10003" onChange={handleChange} />
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Bio / About Me (Appears on public profile)</label>
                                <textarea className="form-control" rows={4} defaultValue="Board-certified Cardiologist with 15 years of experience specializing in interventional cardiology and heart failure management. Completed fellowship at Johns Hopkins Medical Center." onChange={handleChange}></textarea>
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
                                <input type="text" className="form-control" value="EMP-2024-0089" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Department 🔒</label>
                                <input type="text" className="form-control" value="Cardiology" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Specialization 🔒</label>
                                <input type="text" className="form-control" value="Interventional Cardiology" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Years of Experience 🔒</label>
                                <input type="text" className="form-control" value="15 years" readOnly disabled />
                            </div>

                            <div className="form-group">
                                <label>Medical License Number *</label>
                                <input type="text" className="form-control" defaultValue="MD-45678" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>License Expiry Date</label>
                                <input type="date" className="form-control" defaultValue="2025-12-31" onChange={handleChange} />
                                <div className="text-warning text-sm mt-1">⚠️ Expires in 285 days - Renew soon</div>
                            </div>
                            <div className="form-group">
                                <label>Consultation Fee</label>
                                <div className="input-group">
                                    <span className="input-prefix">$</span>
                                    <input type="number" className="form-control" defaultValue="150.00" onChange={handleChange} />
                                </div>
                                <div className="text-secondary text-sm mt-1">Subject to admin approval</div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Qualifications</label>
                                <div className="dynamic-list">
                                    <div className="dynamic-list-item">
                                        <span>MBBS - Johns Hopkins (2005)</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>MD - Cardiology (2008)</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>DM - Interventional Cardiology (2010)</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <button className="btn btn-outline btn-sm mt-2"><Plus size={16} /> Add Qualification</button>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Languages Spoken</label>
                                <div className="checkbox-group row-style">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> English</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Spanish</label>
                                    <label><input type="checkbox" onChange={handleChange} /> French</label>
                                    <label><input type="checkbox" onChange={handleChange} /> Arabic</label>
                                    <button className="btn btn-link btn-sm"><Plus size={14} /> Add Language</button>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Awards & Recognition</label>
                                <div className="dynamic-list">
                                    <div className="dynamic-list-item">
                                        <span>Best Cardiologist Award 2023</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>Patient Choice Award 2022</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <button className="btn btn-outline btn-sm mt-2"><Plus size={16} /> Add Achievement</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">📅 Availability & Schedule Settings</h3>

                        <div className="form-group mb-4">
                            <label className="mb-2 d-block">Current Status</label>
                            <div className="radio-group badge-radio-group">
                                <label className="status-badge status-active mr-2">
                                    <input type="radio" name="availability" defaultChecked onChange={handleChange} className="mr-1" /> 🟢 Available
                                </label>
                                <label className="status-badge status-warning mr-2">
                                    <input type="radio" name="availability" onChange={handleChange} className="mr-1" /> 🟡 In Consultation
                                </label>
                                <label className="status-badge status-inactive mr-2">
                                    <input type="radio" name="availability" onChange={handleChange} className="mr-1" /> 🔴 Unavailable
                                </label>
                                <label className="status-badge bg-blue-100 text-blue-800 border-blue-200">
                                    <input type="radio" name="availability" onChange={handleChange} className="mr-1" /> 🔵 On Break
                                </label>
                            </div>
                        </div>

                        <div className="form-group mb-4 border-bottom pb-4">
                            <label className="mb-2 d-block">Working Days & Hours</label>
                            <div className="schedule-table">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                                    <div className="schedule-row" key={day}>
                                        <div className="schedule-day">
                                            <input type="checkbox" id={`day-${day}`} defaultChecked={i < 5} onChange={handleChange} />
                                            <label htmlFor={`day-${day}`} className="ml-2">{day}</label>
                                        </div>
                                        <div className="schedule-times">
                                            <input type="time" className="form-control input-sm" defaultValue={i < 5 ? (i === 2 ? "09:00" : "09:00") : ""} disabled={i >= 5} onChange={handleChange} />
                                            <span className="mx-2">to</span>
                                            <input type="time" className="form-control input-sm" defaultValue={i < 5 ? (i === 2 ? "13:00" : "17:00") : ""} disabled={i >= 5} onChange={handleChange} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-grid mb-4">
                            <div className="form-group">
                                <label>Appointment Slot Duration</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="slot" defaultChecked onChange={handleChange} /> 15 min</label>
                                    <label><input type="radio" name="slot" onChange={handleChange} /> 30 min</label>
                                    <label><input type="radio" name="slot" onChange={handleChange} /> 45 min</label>
                                    <label><input type="radio" name="slot" onChange={handleChange} /> 60 min</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Maximum Patients Per Day</label>
                                <input type="number" className="form-control" defaultValue="20" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Break Time</label>
                                <div className="d-flex align-items-center mb-2">
                                    <input type="time" className="form-control mr-2" defaultValue="13:00" style={{ width: 150 }} onChange={handleChange} />
                                    <span>to</span>
                                    <input type="time" className="form-control mx-2" defaultValue="14:00" style={{ width: 150 }} onChange={handleChange} />
                                    <button className="btn-link"><Plus size={16} /> Add Break</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label>Vacation / Leave Dates</label>
                            <div className="dynamic-list mb-2">
                                <div className="dynamic-list-item">
                                    <span>March 25, 2024 to March 28, 2024</span>
                                    <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <button className="btn btn-outline btn-sm"><CalendarClock size={16} /> Block Dates</button>
                        </div>

                        <div className="form-group">
                            <label>Auto-Response Message (when unavailable)</label>
                            <textarea className="form-control" rows={3} defaultValue="I am currently unavailable. Please book an appointment for the next available slot or consult another cardiologist in our team." onChange={handleChange}></textarea>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🔔 Notification Preferences</h3>
                        <div className="form-grid">
                            <div className="form-group full-width checkbox-grid">
                                <div>
                                    <h4 className="mb-2">Email Notifications</h4>
                                    <div className="checkbox-group mb-4">
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> New appointment requests</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Patient lab results ready</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Appointment cancellations</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Patient messages</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Daily schedule summary (7 AM)</label>
                                        <label><input type="checkbox" onChange={handleChange} /> Hospital newsletters</label>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-2">SMS Notifications</h4>
                                    <div className="checkbox-group mb-4">
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Emergency patient alerts</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Appointment reminder (30 min before)</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Critical lab results</label>
                                        <label><input type="checkbox" onChange={handleChange} /> All appointment updates</label>
                                    </div>
                                    <h4 className="mb-2 mt-4">In-App Notifications</h4>
                                    <div className="checkbox-group">
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> All patient activity</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> New messages</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Critical alerts (sound + vibration)</label>
                                    </div>
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

                        <div className="mb-4 border-bottom pb-4">
                            <h4 className="mb-2">Two-Factor Authentication</h4>
                            <div className="d-flex align-items-center mb-3">
                                <span>Status:</span>
                                <span className="status-badge status-active ml-2">🟢 Enabled (Recommended)</span>
                            </div>
                            <button className="btn btn-outline btn-sm">Manage 2FA</button>
                        </div>

                        <div>
                            <h4 className="mb-2">Digital Signature (Used on prescriptions)</h4>
                            <div className="signature-preview p-4 border rounded bg-gray-50 mb-3" style={{ fontFamily: 'cursive', fontSize: 24, padding: 20 }}>
                                Dr. Sarah Johnson
                            </div>
                            <button className="btn btn-outline">Update Signature</button>
                        </div>
                    </div>
                )}

                {activeTab === 'display' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🌐 Display & Preferences</h3>
                        <div className="form-group full-width">
                            <p className="text-secondary mb-3">These preferences affect how the dashboard and patient records appear to you.</p>
                        </div>
                        <div className="form-group full-width mb-3">
                            <label>Theme</label>
                            <div className="radio-group">
                                <label><input type="radio" name="themeDoc" defaultChecked onChange={handleChange} /> 🌞 Light Mode</label>
                                <label><input type="radio" name="themeDoc" onChange={handleChange} /> 🌙 Dark Mode</label>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label>Default Patient View</label>
                            <div className="radio-group">
                                <label><input type="radio" name="view" defaultChecked onChange={handleChange} /> Timeline / History</label>
                                <label><input type="radio" name="view" onChange={handleChange} /> Summary Dashboard</label>
                                <label><input type="radio" name="view" onChange={handleChange} /> Recent Vitals & Labs</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

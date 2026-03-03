import { useState } from 'react';
import { User, Briefcase, Stethoscope, Bell, Lock, Monitor, Trash2, Plus } from 'lucide-react';

export default function NurseProfile({ activeTab, setActiveTab, setHasUnsavedChanges }) {
    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'professional', label: 'Professional Info', icon: Briefcase },
        { id: 'clinical', label: 'Clinical Prefs', icon: Stethoscope },
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
                                <input type="text" className="form-control" defaultValue="Emily" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" className="form-control" defaultValue="Carter" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <div className="input-group">
                                    <input type="email" className="form-control" defaultValue="emily.carter@hospital.com" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <button className="btn-link mt-1 text-sm">Change Email</button>
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <div className="input-group">
                                    <input type="tel" className="form-control" defaultValue="+1-555-0189" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <button className="btn-link mt-1 text-sm">Change Phone</button>
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date" className="form-control" defaultValue="1990-11-12" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Gender</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="gendN" onChange={handleChange} /> Male</label>
                                    <label><input type="radio" name="gendN" defaultChecked onChange={handleChange} /> Female</label>
                                    <label><input type="radio" name="gendN" onChange={handleChange} /> Other</label>
                                </div>
                            </div>

                            <h4 className="mt-4 mb-2 full-width border-top pt-4">Emergency Contact</h4>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control" defaultValue="Mark Carter" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Relationship</label>
                                <select className="form-control" defaultValue="Spouse" onChange={handleChange}>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Sibling">Sibling</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="tel" className="form-control" defaultValue="+1-555-0190" onChange={handleChange} />
                            </div>

                            <h4 className="mt-4 mb-2 full-width border-top pt-4">Home Address</h4>
                            <div className="form-group full-width">
                                <label>Street</label>
                                <input type="text" className="form-control" defaultValue="567 Nurse's Lane" onChange={handleChange} />
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
                                <input type="text" className="form-control" defaultValue="10007" onChange={handleChange} />
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
                                <input type="text" className="form-control" value="EMP-2024-0145" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Designation 🔒</label>
                                <input type="text" className="form-control" value="Registered Nurse (RN)" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Department / Ward 🔒</label>
                                <input type="text" className="form-control" value="Intensive Care Unit (ICU)" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Years of Experience 🔒</label>
                                <input type="text" className="form-control" value="12 years" readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Nursing License Number *</label>
                                <input type="text" className="form-control" defaultValue="RN-78901" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>License Expiry</label>
                                <input type="date" className="form-control" defaultValue="2025-06-30" onChange={handleChange} />
                                <div className="text-success text-sm mt-1">✅ Valid for 472 more days</div>
                            </div>

                            <div className="form-group full-width mt-4 border-top pt-4">
                                <label>Nursing Qualifications</label>
                                <div className="dynamic-list">
                                    <div className="dynamic-list-item">
                                        <span>BSN - Bachelor of Science Nursing (2012)</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>Critical Care Nursing Certification (2015)</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>ACLS Certified (2023)</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>BLS Certified (2023)</span>
                                        <button className="btn-icon text-danger"><Trash2 size={16} /></button>
                                    </div>
                                    <button className="btn btn-outline btn-sm mt-2"><Plus size={16} /> Add Qualification</button>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4 border-top pt-4">
                                <label>Areas of Expertise</label>
                                <div className="checkbox-group row-style">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Critical Care / ICU</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Cardiac Care</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Post-operative Care</label>
                                    <label><input type="checkbox" onChange={handleChange} /> Pediatric Nursing</label>
                                    <label><input type="checkbox" onChange={handleChange} /> Oncology Nursing</label>
                                    <label><input type="checkbox" onChange={handleChange} /> Labor & Delivery</label>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4 border-top pt-4">
                                <label>Current Shift Assignment 🔒</label>
                                <div className="p-3 bg-gray-50 border rounded font-medium">Morning: 6:00 AM - 2:00 PM</div>
                            </div>

                            <div className="form-group full-width mt-2">
                                <label>Shift Preference (for scheduling requests)</label>
                                <div className="radio-group row-style">
                                    <label><input type="radio" name="shiftP" defaultChecked onChange={handleChange} /> Morning (6AM-2PM)</label>
                                    <label><input type="radio" name="shiftP" onChange={handleChange} /> Evening (2PM-10PM)</label>
                                    <label><input type="radio" name="shiftP" onChange={handleChange} /> Night (10PM-6AM)</label>
                                    <label><input type="radio" name="shiftP" onChange={handleChange} /> No Preference</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'clinical' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🩺 Clinical Preferences</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Default Ward View</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="wV" defaultChecked onChange={handleChange} /> My Assigned Patients</label>
                                    <label><input type="radio" name="wV" onChange={handleChange} /> Full Ward View</label>
                                    <label><input type="radio" name="wV" onChange={handleChange} /> Critical Patients First</label>
                                </div>
                            </div>

                            <h4 className="full-width mt-4 mb-2 border-top pt-4">Vital Signs Alert Thresholds (Customize alerts)</h4>
                            <div className="form-group">
                                <label>BP Alert above (mmHg)</label>
                                <div className="d-flex align-items-center"><input type="number" className="form-control" defaultValue="140" style={{ width: 80 }} onChange={handleChange} /> <span className="mx-2">/</span> <input type="number" className="form-control" defaultValue="90" style={{ width: 80 }} onChange={handleChange} /></div>
                            </div>
                            <div className="form-group">
                                <label>BP Alert below (mmHg)</label>
                                <div className="d-flex align-items-center"><input type="number" className="form-control" defaultValue="90" style={{ width: 80 }} onChange={handleChange} /> <span className="mx-2">/</span> <input type="number" className="form-control" defaultValue="60" style={{ width: 80 }} onChange={handleChange} /></div>
                            </div>
                            <div className="form-group mt-2">
                                <label>HR Alert above / below (bpm)</label>
                                <div className="d-flex align-items-center"><input type="number" className="form-control" defaultValue="100" style={{ width: 80 }} onChange={handleChange} /> <span className="mx-2">-</span> <input type="number" className="form-control" defaultValue="60" style={{ width: 80 }} onChange={handleChange} /></div>
                            </div>
                            <div className="form-group mt-2">
                                <label>SpO2 Alert below (%)</label>
                                <input type="number" className="form-control" defaultValue="93" style={{ width: 100 }} onChange={handleChange} />
                            </div>
                            <div className="form-group mt-2 mb-4">
                                <label>Temp Alert above (°F)</label>
                                <input type="number" step="0.1" className="form-control" defaultValue="99.5" style={{ width: 100 }} onChange={handleChange} />
                            </div>

                            <div className="form-group full-width border-top pt-4">
                                <label>Medication Reminders</label>
                                <div className="d-flex align-items-center">
                                    <span>Alert me</span>
                                    <input type="number" className="form-control mx-2" defaultValue="15" style={{ width: 70 }} onChange={handleChange} />
                                    <span>minutes before medication due</span>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Auto-charting</label>
                                <div className="checkbox-group">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Auto-save vitals every 5 minutes</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Timestamp all entries automatically</label>
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
                                <h4>Clinical Alerts</h4>
                                <div className="checkbox-group">
                                    <label><input type="checkbox" defaultChecked disabled className="opacity-50" /> Critical vital signs alerts (IMMEDIATE - Cannot disable)</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Medication due in 15 minutes</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> New doctor's orders</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Lab results - Critical values</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Patient call button pressed</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> New patient admission to ward</label>
                                </div>
                            </div>
                            <div className="form-group full-width mb-4">
                                <h4>Administrative</h4>
                                <div className="checkbox-group">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Shift schedule changes</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Leave request status</label>
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Mandatory training reminders</label>
                                    <label><input type="checkbox" onChange={handleChange} /> Hospital general announcements</label>
                                </div>
                            </div>
                            <div className="form-group full-width mb-4">
                                <label>Alert Method for Critical Situations</label>
                                <div className="radio-group py-2">
                                    <label><input type="radio" name="crit" defaultChecked onChange={handleChange} /> Sound + Vibration + Screen popup</label>
                                    <label><input type="radio" name="crit" onChange={handleChange} /> Sound only</label>
                                    <label><input type="radio" name="crit" onChange={handleChange} /> Silent (badge only)</label>
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <h4>Do Not Disturb (Non-critical notifications)</h4>
                                <div className="checkbox-group mb-2 mt-2">
                                    <label><input type="checkbox" defaultChecked onChange={handleChange} /> Enable during patient procedures</label>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="mr-2">Custom time:</span>
                                    <input type="time" className="form-control" defaultValue="02:00" style={{ width: 120 }} onChange={handleChange} />
                                    <span className="mx-2">to</span>
                                    <input type="time" className="form-control" defaultValue="04:00" style={{ width: 120 }} onChange={handleChange} />
                                </div>
                                <div className="text-warning text-sm mt-2">⚠️ Critical alerts always come through</div>
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
                        <div className="form-group full-width mt-4">
                            <label>Auto-lock Screen After (Important for patient data privacy)</label>
                            <div className="radio-group py-2">
                                <label><input type="radio" name="lock" defaultChecked onChange={handleChange} /> 5 minutes</label>
                                <label><input type="radio" name="lock" onChange={handleChange} /> 10 minutes</label>
                                <label><input type="radio" name="lock" onChange={handleChange} /> 30 minutes</label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'display' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🌐 Display Preferences</h3>
                        <div className="form-grid">
                            <div className="form-group full-width mt-2">
                                <label>Theme (Dark mode recommended for night shifts)</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="themeNu" defaultChecked onChange={handleChange} /> 🌞 Light Mode</label>
                                    <label><input type="radio" name="themeNu" onChange={handleChange} /> 🌙 Dark Mode</label>
                                </div>
                            </div>
                            <div className="form-group full-width mt-4">
                                <label>Text Size</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="ts" onChange={handleChange} /> Small</label>
                                    <label><input type="radio" name="ts" defaultChecked onChange={handleChange} /> Medium</label>
                                    <label><input type="radio" name="ts" onChange={handleChange} /> Large</label>
                                    <label><input type="radio" name="ts" onChange={handleChange} /> Extra Large</label>
                                </div>
                            </div>
                            <div className="form-group full-width mt-4">
                                <label>Default Dashboard on Login</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="ddl" defaultChecked onChange={handleChange} /> My Patient List</label>
                                    <label><input type="radio" name="ddl" onChange={handleChange} /> Medication Schedule</label>
                                    <label><input type="radio" name="ddl" onChange={handleChange} /> Vitals Chart View</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

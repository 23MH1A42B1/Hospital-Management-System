import { useState } from 'react';
import { User, Activity, ShieldPlus, Heart, Lock, Bell, Eye, Smartphone, Download, Trash2, Plus } from 'lucide-react';

export default function PatientProfile({ activeTab, setActiveTab, setHasUnsavedChanges }) {
    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'medical', label: 'Medical Info', icon: Activity },
        { id: 'emergency', label: 'Emergency', icon: ShieldPlus },
        { id: 'insurance', label: 'Insurance', icon: Heart },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'privacy', label: 'Privacy', icon: Eye },
        { id: 'devices', label: 'Devices', icon: Smartphone },
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
                                <input type="text" className="form-control" defaultValue="Smith" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <div className="input-group">
                                    <input type="email" className="form-control" defaultValue="john.smith@email.com" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <div className="text-sm mt-1 text-secondary">📧 Used for appointment notifications</div>
                                <button className="btn-link mt-1 text-sm">Change Email</button>
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <div className="input-group">
                                    <input type="tel" className="form-control" defaultValue="+1-555-0156" readOnly />
                                    <span className="input-suffix text-success">✅ Verified</span>
                                </div>
                                <div className="text-sm mt-1 text-secondary">📱 Used for SMS appointment alerts</div>
                                <button className="btn-link mt-1 text-sm">Change Phone</button>
                            </div>
                            <div className="form-group">
                                <label>Alternate Phone</label>
                                <input type="tel" className="form-control" defaultValue="+1-555-0157" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>WhatsApp Number (for notifications)</label>
                                <input type="tel" className="form-control" defaultValue="+1-555-0156" onChange={handleChange} />
                                <div className="mt-1"><label className="text-sm"><input type="checkbox" defaultChecked onChange={handleChange} /> Same as phone number</label></div>
                            </div>
                            <div className="form-group">
                                <label>Date of Birth *</label>
                                <input type="date" className="form-control" defaultValue="1979-03-15" onChange={handleChange} />
                                <div className="text-sm mt-1 text-secondary">Age: 45 years (auto-calculated)</div>
                            </div>
                            <div className="form-group full-width">
                                <label>Gender *</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="genderPat" defaultChecked onChange={handleChange} /> Male</label>
                                    <label><input type="radio" name="genderPat" onChange={handleChange} /> Female</label>
                                    <label><input type="radio" name="genderPat" onChange={handleChange} /> Other</label>
                                    <label><input type="radio" name="genderPat" onChange={handleChange} /> Prefer not to say</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Marital Status</label>
                                <select className="form-control" defaultValue="Married" onChange={handleChange}>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Occupation</label>
                                <input type="text" className="form-control" defaultValue="Software Engineer" onChange={handleChange} />
                            </div>

                            <h4 className="mt-4 mb-2 full-width">Home Address *</h4>
                            <div className="form-group full-width">
                                <label>Street</label>
                                <input type="text" className="form-control" defaultValue="123 Main Street" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Apt/Unit</label>
                                <input type="text" className="form-control" defaultValue="Apt 4B" onChange={handleChange} />
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
                                <input type="text" className="form-control" defaultValue="10001" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <select className="form-control" defaultValue="US" onChange={handleChange}>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                </select>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Preferred Communication Method</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="comm" defaultChecked onChange={handleChange} /> Email</label>
                                    <label><input type="radio" name="comm" onChange={handleChange} /> SMS</label>
                                    <label><input type="radio" name="comm" onChange={handleChange} /> WhatsApp</label>
                                    <label><input type="radio" name="comm" onChange={handleChange} /> Phone Call</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'medical' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🏥 Medical Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Blood Group *</label>
                                <select className="form-control" defaultValue="O+" onChange={handleChange}>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Height (cm / ft in)</label>
                                <div className="d-flex gx-2">
                                    <input type="number" className="form-control" defaultValue="175" placeholder="cm" onChange={handleChange} />
                                    <span className="mx-2 mt-2"> / </span>
                                    <input type="number" className="form-control" defaultValue="5" placeholder="ft" onChange={handleChange} style={{ width: '30%' }} />
                                    <input type="number" className="form-control ml-1" defaultValue="9" placeholder="in" onChange={handleChange} style={{ width: '30%' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Weight (kg / lbs)</label>
                                <div className="d-flex gx-2">
                                    <input type="number" className="form-control" defaultValue="78" placeholder="kg" onChange={handleChange} />
                                    <span className="mx-2 mt-2"> / </span>
                                    <input type="number" className="form-control" defaultValue="172" placeholder="lbs" onChange={handleChange} />
                                </div>
                                <div className="text-xs text-secondary mt-1">Last updated: March 10, 2024</div>
                            </div>
                            <div className="form-group">
                                <label className="invisible">BMI</label>
                                <div className="info-box bg-gray-50 border p-2 mt-2" style={{ lineHeight: '2' }}>
                                    BMI: <strong>25.5 (Normal)</strong> - Auto calculated
                                </div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Known Allergies</label>
                                <div className="dynamic-list">
                                    <div className="dynamic-list-item">
                                        <span>🚨 <strong>Penicillin</strong> - Severity: Severe</span>
                                        <button className="btn-link text-sm">Edit</button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>🚨 <strong>Sulfa drugs</strong> - Severity: Moderate</span>
                                        <button className="btn-link text-sm">Edit</button>
                                    </div>
                                    <button className="btn btn-outline btn-sm mt-2"><Plus size={16} /> Add Allergy</button>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Chronic Conditions</label>
                                <div className="dynamic-list">
                                    <div className="dynamic-list-item">
                                        <span>Hypertension (Since: 2019)</span>
                                        <button className="btn-link text-sm">Edit</button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>Type 2 Diabetes (Since: 2020)</span>
                                        <button className="btn-link text-sm">Edit</button>
                                    </div>
                                    <button className="btn btn-outline btn-sm mt-2"><Plus size={16} /> Add Condition</button>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Current Medications</label>
                                <div className="dynamic-list">
                                    <div className="dynamic-list-item">
                                        <span>Metformin 500mg - 2x daily</span>
                                        <button className="btn-link text-sm">Edit</button>
                                    </div>
                                    <div className="dynamic-list-item">
                                        <span>Amlodipine 5mg - 1x daily</span>
                                        <button className="btn-link text-sm">Edit</button>
                                    </div>
                                    <button className="btn btn-outline btn-sm mt-2"><Plus size={16} /> Add Medication</button>
                                </div>
                            </div>

                            <div className="form-group full-width mt-4">
                                <label>Lifestyle Factors</label>
                                <div className="form-grid">
                                    <div>
                                        <label className="text-sm">Smoking Status</label>
                                        <div className="radio-group row-style">
                                            <label><input type="radio" name="smoke" defaultChecked onChange={handleChange} /> Non-smoker</label>
                                            <label><input type="radio" name="smoke" onChange={handleChange} /> Smoker</label>
                                            <label><input type="radio" name="smoke" onChange={handleChange} /> Ex-smoker</label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm">Alcohol Consumption</label>
                                        <div className="radio-group row-style">
                                            <label><input type="radio" name="alcohol" onChange={handleChange} /> None</label>
                                            <label><input type="radio" name="alcohol" defaultChecked onChange={handleChange} /> Occasional</label>
                                            <label><input type="radio" name="alcohol" onChange={handleChange} /> Moderate</label>
                                            <label><input type="radio" name="alcohol" onChange={handleChange} /> Heavy</label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm">Exercise Frequency</label>
                                        <div className="radio-group row-style">
                                            <label><input type="radio" name="exe" onChange={handleChange} /> Never</label>
                                            <label><input type="radio" name="exe" onChange={handleChange} /> Rarely</label>
                                            <label><input type="radio" name="exe" defaultChecked onChange={handleChange} /> 3-4x/week</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'emergency' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🆘 Emergency Contact Information</h3>
                        <div className="form-grid">
                            <h4 className="full-width mb-2">Primary Emergency Contact</h4>
                            <div className="form-group full-width">
                                <label>Full Name *</label>
                                <input type="text" className="form-control" defaultValue="Sarah Smith" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Relationship *</label>
                                <select className="form-control" defaultValue="Spouse" onChange={handleChange}>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Child">Child</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" className="form-control" defaultValue="+1-555-0157" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Email</label>
                                <input type="email" className="form-control" defaultValue="sarah.smith@email.com" onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label><input type="checkbox" defaultChecked onChange={handleChange} /> Same address as patient</label>
                            </div>

                            <h4 className="full-width mt-4 mb-2 border-top pt-4">Secondary Emergency Contact</h4>
                            <button className="btn btn-outline full-width"><Plus size={16} /> Add Secondary Contact</button>
                        </div>
                    </div>
                )}

                {activeTab === 'insurance' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🛡️ Insurance Information</h3>
                        <div className="form-group mb-4">
                            <label>Has Medical Insurance</label>
                            <div className="radio-group">
                                <label><input type="radio" name="ins" defaultChecked onChange={handleChange} /> Yes</label>
                                <label><input type="radio" name="ins" onChange={handleChange} /> No</label>
                            </div>
                        </div>

                        <div className="border p-4 rounded bg-gray-50 mb-4">
                            <h4 className="mb-3">Primary Insurance</h4>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Provider Name *</label>
                                    <input type="text" className="form-control" defaultValue="HealthCare Plus" onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Policy Number *</label>
                                    <input type="text" className="form-control" defaultValue="HCP-2024-556789" onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Group Number</label>
                                    <input type="text" className="form-control" defaultValue="GRP-001234" onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Policy Holder Name</label>
                                    <input type="text" className="form-control" defaultValue="John Smith" onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Relationship to Policy Holder</label>
                                    <select className="form-control" defaultValue="Self" onChange={handleChange}>
                                        <option value="Self">Self</option>
                                        <option value="Spouse">Spouse</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Valid From</label>
                                    <input type="date" className="form-control" defaultValue="2024-01-01" onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Valid Until</label>
                                    <input type="date" className="form-control" defaultValue="2024-12-31" onChange={handleChange} />
                                    <div className="text-warning text-sm mt-1">⚠️ Expires in 290 days</div>
                                </div>
                                <div className="form-group full-width">
                                    <label>Co-payment Amount</label>
                                    <input type="text" className="form-control" defaultValue="$20.00" disabled />
                                </div>
                            </div>

                            <div className="mt-4">
                                <button className="btn btn-outline btn-sm mr-2 mb-2">Upload Insurance Card Front 📄</button>
                                <button className="btn btn-outline btn-sm mr-2 mb-2">Upload Insurance Card Back 📄</button>
                                <button className="btn btn-link btn-sm mb-2">View Uploaded Documents</button>
                            </div>
                        </div>

                        <button className="btn btn-outline"><Plus size={16} /> Add Secondary Insurance</button>
                    </div>
                )}

                {/* Patient notifications omitted for brevity but include the general structure */}
                {activeTab === 'notifications' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🔔 Notification Preferences</h3>
                        <div className="form-grid">
                            <div className="form-group full-width checkbox-grid">
                                <div>
                                    <h4 className="mb-2">Appointment Notifications</h4>
                                    <div className="checkbox-group mb-4">
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Appointment request submitted confirmation</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Appointment approved by doctor</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Appointment reminder - 24 hours before</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Appointment reminder - 2 hours before</label>
                                    </div>
                                    <h4 className="mb-2">Medical Notifications</h4>
                                    <div className="checkbox-group mb-4">
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Lab results available</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Prescription ready at pharmacy</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Doctor message received</label>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-2">Billing Notifications</h4>
                                    <div className="checkbox-group mb-4">
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> New bill generated</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Payment due reminder</label>
                                    </div>
                                    <h4 className="mb-2">Health Reminders</h4>
                                    <div className="checkbox-group mb-2">
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Medication reminders</label>
                                        <label><input type="checkbox" defaultChecked onChange={handleChange} /> Annual checkup reminder</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional tabs like security, privacy, devices... */}
                {activeTab === 'privacy' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🔏 Privacy Settings</h3>
                        <div className="form-group full-width mb-4 border-bottom pb-4">
                            <h4 className="mb-2">Medical Records Sharing</h4>
                            <div className="checkbox-group">
                                <label><input type="checkbox" defaultChecked onChange={handleChange} /> Allow treating doctors to view full records</label>
                                <label><input type="checkbox" defaultChecked onChange={handleChange} /> Allow nurses to view basic information</label>
                                <label><input type="checkbox" onChange={handleChange} /> Share anonymized data for research</label>
                            </div>
                        </div>
                        <div className="form-group full-width mb-4 border-bottom pb-4">
                            <h4 className="mb-2">Profile Visibility</h4>
                            <div className="radio-group">
                                <label><input type="radio" name="vis" defaultChecked onChange={handleChange} /> Only hospital staff can see my profile</label>
                                <label><input type="radio" name="vis" onChange={handleChange} /> Visible to all system users</label>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <h4 className="mb-3">Data & Privacy</h4>
                            <button className="btn btn-outline mr-2"><Download size={16} /> Download My Data</button>
                            <button className="btn btn-outline text-danger">Delete Account</button>
                        </div>
                    </div>
                )}

                {activeTab === 'devices' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">📱 Connected Devices & Apps</h3>
                        <div className="session-card">
                            <div className="session-icon text-danger">❤️</div>
                            <div className="session-details">
                                <div className="session-device">Apple Health</div>
                                <div className="session-meta">Connected since March 1, 2024 • Syncing: Steps, Heart Rate, Sleep</div>
                            </div>
                            <button className="btn btn-outline btn-sm">Disconnect</button>
                        </div>
                        <div className="session-card mt-3" style={{ opacity: 0.7 }}>
                            <div className="session-icon text-primary">⌚</div>
                            <div className="session-details">
                                <div className="session-device">Fitbit</div>
                                <div className="session-meta">Not Connected</div>
                            </div>
                            <button className="btn btn-outline btn-sm">Connect</button>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="form-section animation-fade-in">
                        <h3 className="section-title">🔒 Security Settings</h3>
                        <p className="text-secondary mb-4 border-bottom pb-4">Manage your password and active sessions.</p>

                        <div className="mb-4">
                            <h4 className="mb-2">Two-Factor Authentication</h4>
                            <div className="d-flex align-items-center mb-3">
                                <span>Status:</span>
                                <span className="status-badge status-inactive ml-2">🔴 Not Enabled</span>
                                <span className="ml-2 text-warning text-sm">⚠️ Recommended for account security</span>
                            </div>
                            <button className="btn btn-outline btn-sm">Enable 2FA</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

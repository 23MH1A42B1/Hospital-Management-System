import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Phone, Mail, MapPin, Shield, Save, X, Check } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { addPatient } from '../../slices/patientsSlice';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const RELATIONS = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other'];
const INSURANCE_PROVIDERS = ['Star Health', 'HDFC Ergo', 'LIC Health', 'New India', 'Bajaj Allianz', 'ICICI Lombard', 'Religare', 'None'];

const initialForm = {
    firstName: '', lastName: '', dob: '', gender: 'Male', bloodGroup: 'O+',
    phone: '', email: '', address: '', city: '', state: '', pincode: '',
    ecName: '', ecRelation: 'Spouse', ecPhone: '',
    height: '', weight: '',
    allergies: '', chronicConditions: '', currentMedications: '',
    hasInsurance: false, insuranceProvider: '', policyNumber: '', policyExpiry: '',
    registrationType: 'walkin',
};

export default function PatientRegistration() {
    const [form, setForm] = useState(initialForm);
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(null);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const toast = useToast();
    const patients = useSelector(s => s.patients.list);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'First name is required';
        if (!form.lastName.trim()) e.lastName = 'Last name is required';
        if (!form.dob) e.dob = 'Date of birth is required';
        if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
        if (!form.ecName.trim()) e.ecName = 'Emergency contact name required';
        if (!form.ecPhone.trim()) e.ecPhone = 'Emergency contact phone required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        const newPatient = {
            id: `p_${Date.now()}`,
            userId: null,
            patientId: `PAT-2024-${String(patients.length + 100).padStart(3, '0')}`,
            name: `${form.firstName} ${form.lastName}`,
            age: new Date().getFullYear() - new Date(form.dob).getFullYear(),
            gender: form.gender,
            bloodGroup: form.bloodGroup,
            phone: form.phone,
            email: form.email,
            address: `${form.address}, ${form.city}, ${form.state} ${form.pincode}`,
            emergencyContact: { name: form.ecName, relation: form.ecRelation, phone: form.ecPhone },
            medicalHistory: {
                allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
                chronicConditions: form.chronicConditions ? form.chronicConditions.split(',').map(s => s.trim()).filter(Boolean) : [],
                previousSurgeries: [],
                currentMedications: form.currentMedications ? form.currentMedications.split(',').map(s => s.trim()).filter(Boolean) : [],
            },
            insurance: form.hasInsurance ? { provider: form.insuranceProvider, policyNumber: form.policyNumber, validUntil: form.policyExpiry } : null,
            registeredOn: new Date().toISOString().split('T')[0],
            visits: 0,
        };
        dispatch(addPatient(newPatient));
        setSuccess(newPatient);
        toast({ type: 'success', title: 'Patient Registered!', message: `${newPatient.name} — ${newPatient.patientId}` });
    };

    const handleReset = () => { setForm(initialForm); setStep(1); setSuccess(null); setErrors({}); };

    if (success) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: 40 }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Check size={32} color="var(--success)" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Patient Registered!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Registration completed successfully</p>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Patient ID</span>
                            <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{success.patientId}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Name</span>
                            <strong>{success.name}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Age / Gender</span>
                            <span>{success.age} yrs · {success.gender}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Blood Group</span>
                            <span>{success.bloodGroup}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleReset}>Register Another</button>
                        <button className="btn btn-primary" style={{ flex: 1 }}>Schedule Appointment</button>
                    </div>
                </div>
            </div>
        );
    }

    const steps = ['Personal Info', 'Contact & Emergency', 'Medical History', 'Insurance'];
    const errField = (k) => errors[k] ? <span style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'block', marginTop: 2 }}>{errors[k]}</span> : null;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>New Patient Registration</h2>
                    <p>Register a walk-in or emergency patient</p>
                </div>
            </div>

            {/* Registration type */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    {[
                        { val: 'walkin', label: '🚶 Walk-in Patient' },
                        { val: 'emergency', label: '🚨 Emergency Patient' },
                        { val: 'scheduled', label: '📅 Scheduled Admission' },
                    ].map(opt => (
                        <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: `2px solid ${form.registrationType === opt.val ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', background: form.registrationType === opt.val ? 'var(--primary-light)' : 'transparent', fontWeight: form.registrationType === opt.val ? 600 : 400 }}>
                            <input type="radio" name="regType" value={opt.val} checked={form.registrationType === opt.val} onChange={e => set('registrationType', e.target.value)} style={{ display: 'none' }} />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
                {steps.map((s, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => setStep(i + 1)}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--border)', color: step >= i + 1 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', zIndex: 1, marginBottom: 6, transition: 'all 0.2s' }}>
                            {step > i + 1 ? <Check size={16} /> : i + 1}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: step === i + 1 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: 32 }}>
                {/* Step 1 - Personal Info */}
                {step === 1 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="var(--primary)" /></div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Personal Information</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div className="form-group">
                                <label className="form-label">First Name *</label>
                                <input className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Enter first name" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                                {errField('firstName')}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name *</label>
                                <input className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Enter last name" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                                {errField('lastName')}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date of Birth *</label>
                                <input type="date" className={`form-input ${errors.dob ? 'error' : ''}`} value={form.dob} onChange={e => set('dob', e.target.value)} />
                                {errField('dob')}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender *</label>
                                <select className="form-input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Blood Group</label>
                                <select className="form-input" value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
                                    {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label className="form-label">Height (cm)</label>
                                    <input type="number" className="form-input" placeholder="170" value={form.height} onChange={e => set('height', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Weight (kg)</label>
                                    <input type="number" className="form-input" placeholder="65" value={form.weight} onChange={e => set('weight', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2 - Contact & Emergency */}
                {step === 2 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={20} color="var(--primary)" /></div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Contact & Emergency Details</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
                                {errField('phone')}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Street Address</label>
                                <input className="form-input" placeholder="House/Flat No, Street, Locality" value={form.address} onChange={e => set('address', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input className="form-input" placeholder="City" value={form.city} onChange={e => set('city', e.target.value)} />
                            </div>
                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label className="form-label">State</label>
                                    <input className="form-input" placeholder="State" value={form.state} onChange={e => set('state', e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">PIN Code</label>
                                    <input className="form-input" placeholder="560001" value={form.pincode} onChange={e => set('pincode', e.target.value)} maxLength={6} />
                                </div>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                            <h4 style={{ fontWeight: 600, marginBottom: 16, color: 'var(--danger)' }}>🚨 Emergency Contact</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Contact Name *</label>
                                    <input className={`form-input ${errors.ecName ? 'error' : ''}`} placeholder="Full name" value={form.ecName} onChange={e => set('ecName', e.target.value)} />
                                    {errField('ecName')}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Relationship</label>
                                    <select className="form-input" value={form.ecRelation} onChange={e => set('ecRelation', e.target.value)}>
                                        {RELATIONS.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number *</label>
                                    <input className={`form-input ${errors.ecPhone ? 'error' : ''}`} placeholder="Emergency contact number" value={form.ecPhone} onChange={e => set('ecPhone', e.target.value)} maxLength={10} />
                                    {errField('ecPhone')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3 - Medical History */}
                {step === 3 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={20} color="var(--primary)" /></div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Medical History</h3>
                        </div>
                        <div style={{ display: 'grid', gap: 20 }}>
                            <div className="form-group">
                                <label className="form-label">Known Allergies</label>
                                <input className="form-input" placeholder="e.g. Penicillin, Aspirin, Peanuts (comma separated)" value={form.allergies} onChange={e => set('allergies', e.target.value)} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Leave blank if none known</span>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Chronic / Existing Conditions</label>
                                <input className="form-input" placeholder="e.g. Hypertension, Diabetes Type 2, Asthma (comma separated)" value={form.chronicConditions} onChange={e => set('chronicConditions', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Current Medications</label>
                                <textarea className="form-input" rows={3} placeholder="List of medicines being taken currently (comma separated)" value={form.currentMedications} onChange={e => set('currentMedications', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4 - Insurance */}
                {step === 4 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={20} color="var(--primary)" /></div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Insurance Information</h3>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.hasInsurance} onChange={e => set('hasInsurance', e.target.checked)} style={{ width: 18, height: 18 }} />
                            <span style={{ fontWeight: 500 }}>Patient has health insurance</span>
                        </label>
                        {form.hasInsurance && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Insurance Provider</label>
                                    <select className="form-input" value={form.insuranceProvider} onChange={e => set('insuranceProvider', e.target.value)}>
                                        <option value="">— Select Provider —</option>
                                        {INSURANCE_PROVIDERS.filter(p => p !== 'None').map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Policy Number</label>
                                    <input className="form-input" placeholder="e.g. SH-2024-98765" value={form.policyNumber} onChange={e => set('policyNumber', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Valid Until</label>
                                    <input type="date" className="form-input" value={form.policyExpiry} onChange={e => set('policyExpiry', e.target.value)} />
                                </div>
                            </div>
                        )}
                        {!form.hasInsurance && (
                            <div style={{ padding: 24, background: 'var(--bg-secondary)', borderRadius: 12, textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Shield size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                                <p>Patient will pay out-of-pocket or we can update insurance details later.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-outline" onClick={() => step > 1 ? setStep(step - 1) : null} disabled={step === 1}>
                        ← Previous
                    </button>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-outline" onClick={handleReset}>
                            <X size={15} /> Clear
                        </button>
                        {step < 4 ? (
                            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                                Next →
                            </button>
                        ) : (
                            <button className="btn btn-success" onClick={handleSubmit}>
                                <Save size={15} /> Register Patient
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

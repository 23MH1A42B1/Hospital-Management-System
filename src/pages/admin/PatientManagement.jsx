import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Plus, Eye, Edit2, X } from 'lucide-react';
import { addPatient, updatePatient } from '../../slices/patientsSlice';
import { BLOOD_GROUPS } from '../../data/mockData';

function PatientModal({ patient, onClose }) {
    const dispatch = useDispatch();
    const isEdit = !!patient;
    const [form, setForm] = useState(() => patient || {
        name: '', age: '', gender: 'Male', bloodGroup: 'O+', phone: '', email: '',
        address: '', medicalHistory: { allergies: [], chronicConditions: [], previousSurgeries: [], currentMedications: [] },
        insurance: null, registeredOn: new Date().toISOString().split('T')[0], visits: 0,
        emergencyContact: { name: '', relation: '', phone: '' },
        patientId: `PAT-2024-${String(Date.now()).slice(-4).padStart(3, '0')}`,
        id: `p_${Date.now()}`,
    });

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) dispatch(updatePatient(form));
        else dispatch(addPatient(form));
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h2>{isEdit ? 'Edit Patient' : 'Register New Patient'}</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <h4 style={{ marginBottom: 16, color: 'var(--primary)' }}>Personal Information</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Full Name <span className="required">*</span></label>
                                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age <span className="required">*</span></label>
                                <input type="number" className="form-control" value={form.age} onChange={e => set('age', +e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <select className="form-control" value={form.gender} onChange={e => set('gender', e.target.value)}>
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Blood Group</label>
                                <select className="form-control" value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
                                    {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone <span className="required">*</span></label>
                                <input className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Address</label>
                                <input className="form-control" value={form.address} onChange={e => set('address', e.target.value)} />
                            </div>
                        </div>

                        <h4 style={{ margin: '20px 0 16px', color: 'var(--primary)' }}>Emergency Contact</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Contact Name</label>
                                <input className="form-control" value={form.emergencyContact?.name || ''} onChange={e => set('emergencyContact', { ...form.emergencyContact, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Relation</label>
                                <input className="form-control" value={form.emergencyContact?.relation || ''} onChange={e => set('emergencyContact', { ...form.emergencyContact, relation: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact Phone</label>
                                <input className="form-control" value={form.emergencyContact?.phone || ''} onChange={e => set('emergencyContact', { ...form.emergencyContact, phone: e.target.value })} />
                            </div>
                        </div>

                        <h4 style={{ margin: '20px 0 16px', color: 'var(--primary)' }}>Medical History</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Known Allergies</label>
                                <input className="form-control" placeholder="Penicillin, Aspirin (comma separated)" value={(form.medicalHistory?.allergies || []).join(', ')} onChange={e => set('medicalHistory', { ...form.medicalHistory, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Chronic Conditions</label>
                                <input className="form-control" placeholder="Diabetes, Hypertension..." value={(form.medicalHistory?.chronicConditions || []).join(', ')} onChange={e => set('medicalHistory', { ...form.medicalHistory, chronicConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Current Medications</label>
                                <input className="form-control" placeholder="Metformin 500mg..." value={(form.medicalHistory?.currentMedications || []).join(', ')} onChange={e => set('medicalHistory', { ...form.medicalHistory, currentMedications: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{isEdit ? 'Save Changes' : 'Register Patient'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PatientDetailModal({ patient, onClose }) {
    if (!patient) return null;
    const mh = patient.medicalHistory || {};
    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <div>
                        <h2>{patient.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Patient ID: {patient.patientId}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                        {[['Age', patient.age + ' years'], ['Gender', patient.gender], ['Blood Group', patient.bloodGroup], ['Phone', patient.phone], ['Total Visits', patient.visits], ['Registered', patient.registeredOn]].map(([l, v]) => (
                            <div key={l} style={{ background: 'var(--bg-main)', padding: '12px 16px', borderRadius: 8 }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{l}</div>
                                <div style={{ fontWeight: 700 }}>{v}</div>
                            </div>
                        ))}
                    </div>

                    {mh.allergies?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>⚠️ Allergies</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {mh.allergies.map(a => <span key={a} className="badge badge-rejected">{a}</span>)}
                            </div>
                        </div>
                    )}

                    {mh.chronicConditions?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>Chronic Conditions</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {mh.chronicConditions.map(c => <span key={c} className="badge badge-pending">{c}</span>)}
                            </div>
                        </div>
                    )}

                    {mh.currentMedications?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>Current Medications</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {mh.currentMedications.map(m => <span key={m} className="badge badge-completed">{m}</span>)}
                            </div>
                        </div>
                    )}

                    {patient.insurance && (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, marginBottom: 8, color: '#065f46' }}>🛡️ Insurance</div>
                            <div style={{ fontSize: '0.875rem', color: '#047857' }}>{patient.insurance.provider} · Policy: {patient.insurance.policyNumber} · Valid till: {patient.insurance.validUntil}</div>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default function PatientManagement() {
    const patients = useSelector(s => s.patients.list);
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editPatient, setEditPatient] = useState(null);
    const [viewPatient, setViewPatient] = useState(null);

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.patientId?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.includes(search)
    );

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Patient Management</h2>
                    <p>{patients.length} registered patients</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                    <Plus size={16} /> Register Patient
                </button>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3>All Patients</h3>
                    <div className="search-box">
                        <Search size={15} className="search-icon" />
                        <input placeholder="Search by name, ID, phone..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Blood</th><th>Phone</th><th>Conditions</th><th>Visits</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.patientId}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{p.email}</div>
                                    </td>
                                    <td>{p.age}y</td>
                                    <td>{p.gender}</td>
                                    <td><span className="badge badge-routine">{p.bloodGroup}</span></td>
                                    <td>{p.phone}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {(p.medicalHistory?.chronicConditions || []).slice(0, 2).map(c => (
                                                <span key={c} style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 4 }}>{c}</span>
                                            ))}
                                            {(p.medicalHistory?.chronicConditions || []).length > 2 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{(p.medicalHistory.chronicConditions.length - 2)}</span>}
                                        </div>
                                    </td>
                                    <td>{p.visits}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setViewPatient(p)} title="View"><Eye size={14} /></button>
                                            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setEditPatient(p)} title="Edit"><Edit2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer">
                    <span>Showing {filtered.length} of {patients.length} patients</span>
                </div>
            </div>

            {showAdd && <PatientModal onClose={() => setShowAdd(false)} />}
            {editPatient && <PatientModal patient={editPatient} onClose={() => setEditPatient(null)} />}
            {viewPatient && <PatientDetailModal patient={viewPatient} onClose={() => setViewPatient(null)} />}
        </div>
    );
}

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Eye, X } from 'lucide-react';

export default function PatientRecords() {
    const patients = useSelector(s => s.patients.list);
    const appointments = useSelector(s => s.appointments.list);
    const { currentUser } = useSelector(s => s.auth);
    const [search, setSearch] = useState('');
    const [viewPatient, setViewPatient] = useState(null);

    // Patients who have visited this doctor
    const myPatientIds = [...new Set(
        appointments.filter(a => a.doctorId === currentUser?.doctorId).map(a => a.patientId)
    )];
    const myPatients = patients.filter(p => myPatientIds.includes(p.id));
    const filtered = myPatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.patientId?.toLowerCase().includes(search.toLowerCase()));

    const getPatientApts = (pid) => appointments.filter(a => a.patientId === pid && a.doctorId === currentUser?.doctorId);

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Patient Records</h2>
                    <p>{myPatients.length} patients under your care</p>
                </div>
                <div className="search-box">
                    <Search size={15} className="search-icon" />
                    <input placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {filtered.map(p => {
                    const ptApts = getPatientApts(p.id);
                    return (
                        <div key={p.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setViewPatient(p)}>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                <div className="avatar avatar-blue">{p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.patientId} · {p.age}y {p.gender} · {p.bloodGroup}</div>
                                </div>
                            </div>
                            {(p.medicalHistory?.chronicConditions || []).length > 0 && (
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                                    {p.medicalHistory.chronicConditions.map(c => <span key={c} className="badge badge-pending" style={{ fontSize: '0.68rem' }}>{c}</span>)}
                                </div>
                            )}
                            {(p.medicalHistory?.allergies || []).length > 0 && (
                                <div style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>⚠️ Allergies: {p.medicalHistory.allergies.join(', ')}</div>
                            )}
                            <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                                {ptApts.length} visits · Last seen: {ptApts.sort((a, b) => b.date.localeCompare(a.date))[0]?.date || '—'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {viewPatient && (
                <div className="modal-overlay">
                    <div className="modal modal-lg">
                        <div className="modal-header">
                            <div>
                                <h2>{viewPatient.name}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{viewPatient.patientId} · {viewPatient.age}y · {viewPatient.bloodGroup}</p>
                            </div>
                            <button className="modal-close" onClick={() => setViewPatient(null)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                                {[['Phone', viewPatient.phone], ['Email', viewPatient.email], ['Gender', viewPatient.gender], ['Address', viewPatient.address]].map(([l, v]) => (
                                    <div key={l} style={{ background: 'var(--bg-main)', padding: '10px 14px', borderRadius: 8 }}>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{l}</div>
                                        <div style={{ fontWeight: 600, marginTop: 2 }}>{v || '—'}</div>
                                    </div>
                                ))}
                            </div>

                            {viewPatient.medicalHistory?.allergies?.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--danger)' }}>⚠️ Known Allergies</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {viewPatient.medicalHistory.allergies.map(a => <span key={a} className="badge badge-rejected">{a}</span>)}
                                    </div>
                                </div>
                            )}

                            {viewPatient.medicalHistory?.currentMedications?.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 8 }}>💊 Current Medications</div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {viewPatient.medicalHistory.currentMedications.map(m => <span key={m} className="badge badge-completed">{m}</span>)}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div style={{ fontWeight: 700, marginBottom: 12 }}>Visit History</div>
                                {appointments.filter(a => a.patientId === viewPatient.id && a.doctorId === currentUser?.doctorId).map(apt => (
                                    <div key={apt.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '12px', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={{ fontWeight: 600 }}>{apt.date} at {apt.time}</div>
                                            <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                                        </div>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>{apt.reason?.slice(0, 120)}</div>
                                        {apt.rating && <div style={{ marginTop: 6, fontSize: '0.82rem', color: '#f59e0b' }}>⭐ {apt.rating}/5 — {apt.review}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setViewPatient(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

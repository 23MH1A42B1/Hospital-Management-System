import { useSelector } from 'react-redux';
import { FileText, Pill } from 'lucide-react';

const MOCK_RECORDS = [
    { id: 'mr1', patientId: 'p1', date: '2024-01-14', doctor: 'Dr. Priya Sharma', dept: 'Cardiology', diagnosis: 'Hypertensive Heart Disease', prescriptions: ['Amlodipine 5mg - 1 tablet daily', 'Metoprolol 25mg - 1 tablet twice daily'], tests: ['ECG - Normal Sinus Rhythm', 'Echo - Mild LV Hypertrophy'], notes: 'Patient has elevated BP of 160/100mmHg. Increased medication dosage. Follow-up in 2 weeks.' },
    { id: 'mr2', patientId: 'p1', date: '2024-02-02', doctor: 'Dr. Priya Sharma', dept: 'Cardiology', diagnosis: 'Hypertension - Stable', prescriptions: ['Continue Amlodipine 5mg', 'Metoprolol 25mg'], tests: ['Blood Pressure Check - 140/90mmHg'], notes: 'BP slightly improved. Continue current medication. Next visit in 1 month.' },
];

export default function MedicalRecords() {
    const { currentUser } = useSelector(s => s.auth);
    const appointments = useSelector(s => s.appointments.list);
    const patients = useSelector(s => s.patients.list);
    const patient = patients.find(p => p.id === currentUser?.patientId);

    const completed = appointments.filter(a => a.patientId === currentUser?.patientId && a.status === 'completed');
    const records = MOCK_RECORDS.filter(r => r.patientId === currentUser?.patientId);

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Medical Records</h2>
                    <p>Your health history and prescriptions</p>
                </div>
            </div>

            {/* Medical Profile */}
            {patient && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>Health Overview</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                        {[['Blood Group', patient.bloodGroup], ['Age', `${patient.age} years`], ['Gender', patient.gender], ['Total Visits', patient.visits]].map(([l, v]) => (
                            <div key={l} style={{ background: 'var(--bg-main)', padding: '12px 16px', borderRadius: 10 }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>{l}</div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{v}</div>
                            </div>
                        ))}
                    </div>

                    {patient.medicalHistory?.allergies?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>⚠️ Allergies</div>
                            <div style={{ display: 'flex', gap: 8 }}>{patient.medicalHistory.allergies.map(a => <span key={a} className="badge badge-rejected">{a}</span>)}</div>
                        </div>
                    )}
                    {patient.medicalHistory?.chronicConditions?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>Chronic Conditions</div>
                            <div style={{ display: 'flex', gap: 8 }}>{patient.medicalHistory.chronicConditions.map(c => <span key={c} className="badge badge-pending">{c}</span>)}</div>
                        </div>
                    )}
                    {patient.medicalHistory?.previousSurgeries?.length > 0 && (
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>Previous Surgeries</div>
                            <div style={{ display: 'flex', gap: 8 }}>{patient.medicalHistory.previousSurgeries.map(s => <span key={s} className="badge badge-routine">{s}</span>)}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Visit Records */}
            <h3 style={{ marginBottom: 16 }}>Consultation Records</h3>
            {records.length === 0 && completed.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><FileText size={40} /></div>
                    <h3>No records found</h3>
                    <p>Medical records will appear here after completed appointments.</p>
                </div>
            ) : (
                records.map(rec => (
                    <div key={rec.id} className="card" style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{rec.diagnosis}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{rec.date} · {rec.doctor} · {rec.dept}</div>
                            </div>
                            <span className="badge badge-completed">completed</span>
                        </div>

                        {rec.notes && (
                            <div style={{ background: 'var(--bg-main)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '0.875rem' }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>Doctor's Notes</div>
                                {rec.notes}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {rec.prescriptions?.length > 0 && (
                                <div>
                                    <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <Pill size={15} color="var(--primary)" /> Prescriptions
                                    </div>
                                    {rec.prescriptions.map(p => (
                                        <div key={p} style={{ padding: '8px 10px', background: 'var(--primary-light)', borderRadius: 6, marginBottom: 6, fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 500 }}>
                                            💊 {p}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {rec.tests?.length > 0 && (
                                <div>
                                    <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <FileText size={15} color="#059669" /> Lab Results
                                    </div>
                                    {rec.tests.map(t => (
                                        <div key={t} style={{ padding: '8px 10px', background: '#f0fdf4', borderRadius: 6, marginBottom: 6, fontSize: '0.82rem', color: '#065f46', fontWeight: 500 }}>
                                            🔬 {t}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

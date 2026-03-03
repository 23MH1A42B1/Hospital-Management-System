import { useSelector } from 'react-redux';
import { Users, ClipboardList, Heart, Activity } from 'lucide-react';

export default function NurseDashboard() {
    const appointments = useSelector(s => s.appointments.list);
    const patients = useSelector(s => s.patients.list);

    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter(a => a.date === today && a.status === 'approved');

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Nurse Dashboard</h2>
                    <p>Patient care and ward management</p>
                </div>
            </div>

            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card blue"><div className="kpi-icon blue"><Users size={22} /></div><div className="kpi-info"><div className="kpi-value">{patients.length}</div><div className="kpi-label">Total Patients</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green"><Activity size={22} /></div><div className="kpi-info"><div className="kpi-value">{todayApts.length}</div><div className="kpi-label">Patients Today</div></div></div>
                <div className="kpi-card teal"><div className="kpi-icon teal"><Heart size={22} /></div><div className="kpi-info"><div className="kpi-value">12</div><div className="kpi-label">Vitals Recorded</div></div></div>
                <div className="kpi-card purple"><div className="kpi-icon purple"><ClipboardList size={22} /></div><div className="kpi-info"><div className="kpi-value">8</div><div className="kpi-label">Tasks Pending</div></div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 16 }}>Today's Patient List</div>
                    {todayApts.length === 0 ? (
                        <div className="empty-state" style={{ padding: '20px 0' }}><p>No confirmed appointments today</p></div>
                    ) : todayApts.slice(0, 8).map(apt => (
                        <div key={apt.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{apt.patientName}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{apt.time} · {apt.department}</div>
                            </div>
                            <span className="badge badge-approved">In queue</span>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="card-title" style={{ marginBottom: 16 }}>Patient Vitals — Quick View</div>
                    {patients.slice(0, 6).map(p => (
                        <div key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{p.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.bloodGroup} · {p.age}y</div>
                            </div>
                            <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <span>💓 {Math.floor(65 + ((p.id.length * 7) % 30))}/min</span>
                                <span>🩸 {Math.floor(110 + ((p.id.length * 11) % 30))}/{Math.floor(70 + ((p.id.length * 13) % 20))}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

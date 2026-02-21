import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, Calendar, Bell, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientDashboard() {
    const { currentUser } = useSelector(s => s.auth);
    const appointments = useSelector(s => s.appointments.list);
    const notifications = useSelector(s => s.notifications.list.filter(n => n.userId === currentUser?.id && !n.read));
    const navigate = useNavigate();
    const patients = useSelector(s => s.patients.list);

    const patient = patients.find(p => p.id === currentUser?.patientId);
    const myApts = appointments.filter(a => a.patientId === currentUser?.patientId);
    const upcoming = myApts.filter(a => ['approved', 'pending'].includes(a.status) && a.date >= new Date().toISOString().split('T')[0])
        .sort((a, b) => a.date.localeCompare(b.date));

    const statusColor = { pending: '#d97706', approved: '#059669', completed: '#1a56db', rejected: '#dc2626', rescheduled: '#7c3aed' };

    return (
        <div>
            {/* Welcome Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1a56db, #0891b2)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 28, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -30, right: 60, width: 80, height: 80, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                <h2 style={{ color: '#fff', marginBottom: 4 }}>Welcome, {currentUser?.name?.split(' ')[0]}! 👋</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>{patient?.patientId} · {patient?.age}y · {patient?.bloodGroup}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }} onClick={() => navigate('/patient/request-appointment')}>
                        <CalendarPlus size={16} /> Book Appointment
                    </button>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => navigate('/patient/appointments')}>
                        <Calendar size={16} /> My Appointments
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="kpi-grid" style={{ marginBottom: 28 }}>
                <div className="kpi-card blue"><div className="kpi-icon blue"><Calendar size={22} /></div><div className="kpi-info"><div className="kpi-value">{myApts.length}</div><div className="kpi-label">Total Appointments</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green"><Calendar size={22} /></div><div className="kpi-info"><div className="kpi-value">{upcoming.length}</div><div className="kpi-label">Upcoming</div></div></div>
                <div className="kpi-card orange"><div className="kpi-icon orange"><Bell size={22} /></div><div className="kpi-info"><div className="kpi-value">{notifications.length}</div><div className="kpi-label">Unread Notifications</div></div></div>
                <div className="kpi-card purple"><div className="kpi-icon purple"><FileText size={22} /></div><div className="kpi-info"><div className="kpi-value">{patient?.visits || 0}</div><div className="kpi-label">Total Hospital Visits</div></div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Upcoming Appointments */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div className="card-title">Upcoming Appointments</div>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/patient/appointments')}>View All</button>
                    </div>
                    {upcoming.length === 0 ? (
                        <div className="empty-state" style={{ padding: '20px 0' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div>
                            <p>No upcoming appointments</p>
                            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/patient/request-appointment')}>Book Now</button>
                        </div>
                    ) : upcoming.map(apt => (
                        <div key={apt.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'center' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{apt.date.split('-')[2]}</div>
                                <div style={{ fontSize: '0.62rem', color: 'var(--primary)', fontWeight: 600 }}>
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+apt.date.split('-')[1] - 1]}
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>{apt.doctorName}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.department} · {apt.time} · {apt.visitType}</div>
                            </div>
                            <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                        </div>
                    ))}
                </div>

                {/* Quick Info + Medical */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {patient?.medicalHistory?.allergies?.length > 0 && (
                        <div className="card" style={{ border: '1px solid #fca5a5', background: '#fff1f2' }}>
                            <div style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: 10 }}>⚠️ Allergy Alert</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {patient.medicalHistory.allergies.map(a => <span key={a} className="badge badge-rejected">{a}</span>)}
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 12 }}>💊 Current Medications</div>
                        {(patient?.medicalHistory?.currentMedications || []).length === 0 ? (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>None recorded</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {patient.medicalHistory.currentMedications.map(m => (
                                    <div key={m} style={{ fontSize: '0.82rem', padding: '6px 10px', background: 'var(--bg-main)', borderRadius: 6 }}>💊 {m}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="card">
                            <div className="card-title" style={{ marginBottom: 12 }}>🔔 New Notifications</div>
                            {notifications.slice(0, 3).map(n => (
                                <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.82rem' }}>
                                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{n.message.slice(0, 70)}...</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

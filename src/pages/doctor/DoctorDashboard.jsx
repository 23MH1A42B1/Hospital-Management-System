import { useSelector } from 'react-redux';
import { Calendar, Clock, Users, TrendingUp, Star } from 'lucide-react';

export default function DoctorDashboard() {
    const { currentUser } = useSelector(s => s.auth);
    const appointments = useSelector(s => s.appointments.list);
    const doctors = useSelector(s => s.doctors.list);
    const doctor = doctors.find(d => d.id === currentUser?.doctorId);

    const today = new Date().toISOString().split('T')[0];
    const myApts = appointments.filter(a => a.doctorId === currentUser?.doctorId);
    const pendingApts = myApts.filter(a => a.status === 'pending');
    const todayApts = myApts.filter(a => a.date === today);
    const completedApts = myApts.filter(a => a.status === 'completed');

    const statusColor = { pending: 'orange', approved: 'green', completed: 'blue', rejected: 'red', cancelled: 'cancelled', rescheduled: 'purple' };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Doctor Dashboard</h2>
                    <p>{doctor?.specialization} · {currentUser?.department}</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpi-grid" style={{ marginBottom: 28 }}>
                <div className="kpi-card orange">
                    <div className="kpi-icon orange"><Clock size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{pendingApts.length}</div>
                        <div className="kpi-label">Pending Requests</div>
                        {pendingApts.length > 0 && <div className="kpi-trend down" style={{ color: 'var(--warning)' }}>Requires your action</div>}
                    </div>
                </div>
                <div className="kpi-card blue">
                    <div className="kpi-icon blue"><Calendar size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{todayApts.length}</div>
                        <div className="kpi-label">Today's Appointments</div>
                    </div>
                </div>
                <div className="kpi-card green">
                    <div className="kpi-icon green"><Users size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{doctor?.totalPatients?.toLocaleString() || '—'}</div>
                        <div className="kpi-label">Total Patients</div>
                    </div>
                </div>
                <div className="kpi-card teal">
                    <div className="kpi-icon teal"><Star size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{doctor?.rating || '—'}</div>
                        <div className="kpi-label">Average Rating</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Pending Requests */}
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 16 }}>⏳ Pending Requests ({pendingApts.length})</div>
                    {pendingApts.length === 0 ? (
                        <div className="empty-state" style={{ padding: '30px 0' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
                            <p>No pending requests!</p>
                        </div>
                    ) : pendingApts.slice(0, 4).map(apt => (
                        <div key={apt.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontWeight: 600 }}>{apt.patientName}</span>
                                <span className={`badge badge-${apt.urgency?.toLowerCase()}`}>{apt.urgency}</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{apt.date} at {apt.time} · {apt.visitType}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{apt.reason?.slice(0, 80)}...</div>
                        </div>
                    ))}
                </div>

                {/* Today's Schedule */}
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 16 }}>📅 Today's Schedule</div>
                    {todayApts.length === 0 ? (
                        <div className="empty-state" style={{ padding: '30px 0' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
                            <p>No appointments today</p>
                        </div>
                    ) : (
                        <div className="timeline">
                            {todayApts.sort((a, b) => a.time.localeCompare(b.time)).map(apt => (
                                <div key={apt.id} className="timeline-item">
                                    <div className="timeline-dot" />
                                    <div className="timeline-content">
                                        <div className="timeline-time">{apt.time}</div>
                                        <div className="timeline-title">{apt.patientName}</div>
                                        <div className="timeline-desc">{apt.visitType} · {apt.department}</div>
                                        <span className={`badge badge-${apt.status}`} style={{ marginTop: 4 }}>{apt.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Doctor Profile Card */}
            {doctor && (
                <div className="card" style={{ marginTop: 24 }}>
                    <div className="card-title" style={{ marginBottom: 16 }}>My Profile</div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div>
                            <div className="avatar avatar-xl avatar-teal" style={{ fontSize: '1.5rem' }}>
                                {doctor.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ marginBottom: 4 }}>{doctor.name}</h3>
                            <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{doctor.specialization} · {doctor.qualifications}</div>
                            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                                <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>EXPERIENCE</div><div style={{ fontWeight: 700 }}>{doctor.experience} years</div></div>
                                <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PATIENTS TREATED</div><div style={{ fontWeight: 700 }}>{doctor.totalPatients?.toLocaleString()}</div></div>
                                <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CONSULTATION FEE</div><div style={{ fontWeight: 700 }}>₹{doctor.consultationFee}</div></div>
                                <div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>WORKING DAYS</div><div style={{ fontWeight: 700 }}>{doctor.workingDays?.join(', ')}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

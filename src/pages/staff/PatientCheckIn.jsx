import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, CheckCircle, Clock, User, AlertCircle, ChevronRight } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { approveAppointment } from '../../slices/appointmentsSlice';

const QUEUE_COLORS = { waiting: 'var(--warning)', in_consultation: 'var(--info)', checked_in: 'var(--success)', not_arrived: 'var(--text-muted)' };
const ZONE_LABELS = { Cardiology: 'Zone A', Neurology: 'Zone B', Orthopedics: 'Zone C', Pediatrics: 'Zone D', Emergency: 'Zone E', default: 'Zone G' };

function getZone(dept) { return ZONE_LABELS[dept] || ZONE_LABELS.default; }
function getToken(idx) { return `A-0${44 + idx}`; }

export default function PatientCheckIn() {
    const appointments = useSelector(s => s.appointments.list);
    const patients = useSelector(s => s.patients.list);
    const dispatch = useDispatch();
    const toast = useToast();
    const [search, setSearch] = useState('');
    const [selectedApt, setSelectedApt] = useState(null);
    const [checkedIn, setCheckedIn] = useState({});
    const [vitalsForm, setVitalsForm] = useState({ bp: '', temp: '', weight: '', payment: 'insurance' });
    const [showModal, setShowModal] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter(a => a.date === today && ['approved', 'pending'].includes(a.status));
    const filtered = todayApts.filter(a =>
        !search || a.patientName?.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleCheckIn = (apt) => {
        setSelectedApt(apt);
        setVitalsForm({ bp: '', temp: '', weight: '', payment: 'insurance' });
        setShowModal(true);
    };

    const confirmCheckIn = () => {
        setCheckedIn(prev => ({ ...prev, [selectedApt.id]: { ...selectedApt, checkinTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }), vitals: vitalsForm } }));
        toast({ type: 'success', title: 'Checked In!', message: `${selectedApt.patientName} → ${getZone(selectedApt.department)} · Token: ${getToken(Object.keys(checkedIn).length)}` });
        setShowModal(false);
    };

    const getStatus = (apt) => {
        if (checkedIn[apt.id]) return 'checked_in';
        return 'not_arrived';
    };

    const stats = {
        total: todayApts.length,
        checkedIn: Object.keys(checkedIn).length,
        waiting: todayApts.length - Object.keys(checkedIn).length,
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Patient Check-In</h2>
                    <p>Manage today's appointment arrivals</p>
                </div>
            </div>

            {/* Stats */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card blue"><div className="kpi-icon blue"><Clock size={22} /></div><div className="kpi-info"><div className="kpi-value">{stats.total}</div><div className="kpi-label">Today's Appointments</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green"><CheckCircle size={22} /></div><div className="kpi-info"><div className="kpi-value">{stats.checkedIn}</div><div className="kpi-label">Checked In</div></div></div>
                <div className="kpi-card orange"><div className="kpi-icon orange"><User size={22} /></div><div className="kpi-info"><div className="kpi-value">{stats.waiting}</div><div className="kpi-label">Yet to Arrive</div></div></div>
                <div className="kpi-card purple"><div className="kpi-icon purple"><AlertCircle size={22} /></div><div className="kpi-info"><div className="kpi-value">{todayApts.filter(a => a.urgency === 'Urgent' || a.urgency === 'Emergency').length}</div><div className="kpi-label">Urgent Cases</div></div></div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <div style={{ fontWeight: 600 }}>Today's Schedule</div>
                    <div className="search-box">
                        <Search size={15} className="search-icon" />
                        <input placeholder="Search by patient name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead><tr><th>Time</th><th>Patient</th><th>Doctor</th><th>Department</th><th>Type</th><th>Urgency</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={8}><div className="empty-state"><p>No appointments found for today</p></div></td></tr>
                            )}
                            {filtered.map((apt, idx) => {
                                const status = getStatus(apt);
                                const ci = checkedIn[apt.id];
                                return (
                                    <tr key={apt.id} style={{ background: ci ? 'rgba(34,197,94,0.05)' : undefined }}>
                                        <td><strong>{apt.time}</strong></td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{apt.patientName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.id}</div>
                                        </td>
                                        <td>{apt.doctorName}</td>
                                        <td>{apt.department}</td>
                                        <td><span className="badge badge-routine">{apt.visitType}</span></td>
                                        <td><span className={`badge badge-${apt.urgency?.toLowerCase()}`}>{apt.urgency}</span></td>
                                        <td>
                                            {ci ? (
                                                <div>
                                                    <span className="badge badge-approved">✅ Checked In</span>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{ci.checkinTime} · Token: {getToken(idx)}</div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>→ {getZone(apt.department)}</div>
                                                </div>
                                            ) : (
                                                <span className="badge badge-pending">⏳ Not Arrived</span>
                                            )}
                                        </td>
                                        <td>
                                            {!ci && (
                                                <button className="btn btn-primary btn-sm" onClick={() => handleCheckIn(apt)}>
                                                    Check In <ChevronRight size={13} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer"><span>{filtered.length} appointments</span></div>
            </div>

            {/* Check-in Modal */}
            {showModal && selectedApt && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div className="card" style={{ width: 520, maxHeight: '85vh', overflowY: 'auto', padding: 32 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Check-In: {selectedApt.patientName}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Appointment #{selectedApt.id} · {selectedApt.time}</p>

                        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.88rem' }}>
                                <div><span style={{ color: 'var(--text-muted)' }}>Doctor:</span> <strong>{selectedApt.doctorName}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Dept:</span> <strong>{selectedApt.department}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> <strong>{selectedApt.visitType}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Zone:</span> <strong style={{ color: 'var(--primary)' }}>{getZone(selectedApt.department)}</strong></div>
                            </div>
                        </div>

                        <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Quick Vitals (Optional)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                            <div className="form-group">
                                <label className="form-label">BP (mmHg)</label>
                                <input className="form-input" placeholder="120/80" value={vitalsForm.bp} onChange={e => setVitalsForm(f => ({ ...f, bp: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Temp (°F)</label>
                                <input className="form-input" placeholder="98.6" value={vitalsForm.temp} onChange={e => setVitalsForm(f => ({ ...f, temp: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Weight (kg)</label>
                                <input className="form-input" placeholder="65" value={vitalsForm.weight} onChange={e => setVitalsForm(f => ({ ...f, weight: e.target.value }))} />
                            </div>
                        </div>

                        <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Payment Mode</h4>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                            {['insurance', 'cash', 'card'].map(m => (
                                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: `2px solid ${vitalsForm.payment === m ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: vitalsForm.payment === m ? 'var(--primary-light)' : 'transparent', textTransform: 'capitalize', fontWeight: vitalsForm.payment === m ? 600 : 400, fontSize: '0.88rem' }}>
                                    <input type="radio" hidden checked={vitalsForm.payment === m} onChange={() => setVitalsForm(f => ({ ...f, payment: m }))} />
                                    {m}
                                </label>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-success" style={{ flex: 2 }} onClick={confirmCheckIn}>
                                <CheckCircle size={15} /> Confirm Check-In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

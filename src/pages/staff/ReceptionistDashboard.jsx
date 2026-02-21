import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, CheckCircle, X, Calendar, Clock, User } from 'lucide-react';
import { approveAppointment, rejectAppointment } from '../../slices/appointmentsSlice';
import { useToast } from '../../components/Toast';

export default function ReceptionistDashboard() {
    const appointments = useSelector(s => s.appointments.list);
    const patients = useSelector(s => s.patients.list);
    const dispatch = useDispatch();
    const toast = useToast();
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('today');

    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter(a => a.date === today);
    const pendingApts = appointments.filter(a => a.status === 'pending');
    const allFilteredApts = (tab === 'today' ? todayApts : pendingApts)
        .filter(a => a.patientName?.toLowerCase().includes(search.toLowerCase()) || a.doctorName?.toLowerCase().includes(search.toLowerCase()));

    const handleApprove = (apt) => {
        dispatch(approveAppointment({ id: apt.id, notes: 'Approved by receptionist' }));
        toast({ type: 'success', title: 'Confirmed', message: `${apt.patientName} — ${apt.date} at ${apt.time}` });
    };
    const handleReject = (apt) => {
        dispatch(rejectAppointment({ id: apt.id, reason: 'Appointment slot unavailable' }));
        toast({ type: 'warning', title: 'Rejected', message: `${apt.patientName}'s request rejected` });
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Reception Dashboard</h2>
                    <p>Managing appointments and patient flow</p>
                </div>
            </div>

            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card blue"><div className="kpi-icon blue"><Calendar size={22} /></div><div className="kpi-info"><div className="kpi-value">{todayApts.length}</div><div className="kpi-label">Today's Appointments</div></div></div>
                <div className="kpi-card orange"><div className="kpi-icon orange"><Clock size={22} /></div><div className="kpi-info"><div className="kpi-value">{pendingApts.length}</div><div className="kpi-label">Pending Requests</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green"><CheckCircle size={22} /></div><div className="kpi-info"><div className="kpi-value">{todayApts.filter(a => a.status === 'approved').length}</div><div className="kpi-label">Confirmed Today</div></div></div>
                <div className="kpi-card purple"><div className="kpi-icon purple"><User size={22} /></div><div className="kpi-info"><div className="kpi-value">{patients.length}</div><div className="kpi-label">Total Patients</div></div></div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <div className="tabs">
                        <button className={`tab-btn ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>Today <span className="tab-count">{todayApts.length}</span></button>
                        <button className={`tab-btn ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>Pending <span className="tab-count">{pendingApts.length}</span></button>
                    </div>
                    <div className="search-box">
                        <Search size={15} className="search-icon" />
                        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Urgency</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {allFilteredApts.map(apt => (
                                <tr key={apt.id}>
                                    <td><strong>{apt.patientName}</strong></td>
                                    <td>{apt.doctorName}</td>
                                    <td>{apt.date}</td>
                                    <td>{apt.time}</td>
                                    <td><span className="badge badge-routine">{apt.visitType}</span></td>
                                    <td><span className={`badge badge-${apt.urgency?.toLowerCase()}`}>{apt.urgency}</span></td>
                                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                                    <td>
                                        {apt.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(apt)}><CheckCircle size={13} /></button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleReject(apt)}><X size={13} /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer"><span>{allFilteredApts.length} appointments</span></div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, RefreshCw, X, Clock, AlertTriangle, User, Calendar, MessageSquare } from 'lucide-react';
import { approveAppointment, rejectAppointment, rescheduleAppointment } from '../../slices/appointmentsSlice';
import { addNotification } from '../../slices/notificationsSlice';
import { useToast } from '../../components/Toast';

function ActionModal({ type, appointment, onClose }) {
    const dispatch = useDispatch();
    const toast = useToast();
    const [notes, setNotes] = useState('');
    const [reason, setReason] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const handleApprove = () => {
        dispatch(approveAppointment({ id: appointment.id, notes }));
        // Find patient user and notify
        dispatch(addNotification({
            userId: `u${appointment.patientId?.slice(1)}`,
            type: 'appointment_approved',
            title: '🎉 Appointment Confirmed!',
            message: `Your appointment with ${appointment.doctorName} on ${appointment.date} at ${appointment.time} has been approved! Appointment #${appointment.appointmentNumber}`,
            appointmentId: appointment.id,
        }));
        toast({ type: 'success', title: 'Appointment Approved', message: `Confirmed for ${appointment.patientName} on ${appointment.date}` });
        onClose();
    };

    const handleReject = () => {
        if (!reason.trim()) return;
        dispatch(rejectAppointment({ id: appointment.id, reason }));
        dispatch(addNotification({
            userId: `u${appointment.patientId?.slice(1)}`,
            type: 'appointment_rejected',
            title: 'Appointment Not Approved',
            message: `Your appointment request was not approved. Reason: ${reason}`,
            appointmentId: appointment.id,
        }));
        toast({ type: 'warning', title: 'Appointment Rejected', message: `Reason sent to ${appointment.patientName}` });
        onClose();
    };

    const handleReschedule = () => {
        if (!newDate || !newTime || !reason.trim()) return;
        dispatch(rescheduleAppointment({ id: appointment.id, newDate, newTime, reason }));
        dispatch(addNotification({
            userId: `u${appointment.patientId?.slice(1)}`,
            type: 'appointment_approved',
            title: 'Appointment Rescheduled',
            message: `${appointment.doctorName} has proposed a new time: ${newDate} at ${newTime}. Reason: ${reason}`,
            appointmentId: appointment.id,
        }));
        toast({ type: 'info', title: 'Reschedule Proposed', message: `New time sent to ${appointment.patientName}` });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal-sm">
                <div className="modal-header">
                    <h2>
                        {type === 'approve' && '✅ Approve Appointment'}
                        {type === 'reject' && '❌ Reject Appointment'}
                        {type === 'reschedule' && '🔄 Propose New Time'}
                    </h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div style={{ background: 'var(--bg-main)', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
                        <div style={{ fontWeight: 600 }}>{appointment.patientName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appointment.date} at {appointment.time} · {appointment.visitType}</div>
                    </div>

                    {type === 'approve' && (
                        <div className="form-group">
                            <label className="form-label">Notes for Patient (optional)</label>
                            <textarea className="form-control" rows={3} placeholder="E.g. Bring all previous test reports..." value={notes} onChange={e => setNotes(e.target.value)} />
                        </div>
                    )}

                    {type === 'reject' && (
                        <div className="form-group">
                            <label className="form-label">Rejection Reason <span className="required">*</span></label>
                            <textarea className="form-control" rows={3} placeholder="Please provide a clear reason..." value={reason} onChange={e => setReason(e.target.value)} required />
                            {!reason.trim() && <div className="form-error">Reason is required</div>}
                        </div>
                    )}

                    {type === 'reschedule' && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Proposed Date <span className="required">*</span></label>
                                <input type="date" className="form-control" value={newDate} onChange={e => setNewDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Proposed Time <span className="required">*</span></label>
                                <input type="time" className="form-control" value={newTime} onChange={e => setNewTime(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Reason for Reschedule <span className="required">*</span></label>
                                <textarea className="form-control" rows={2} value={reason} onChange={e => setReason(e.target.value)} required />
                            </div>
                        </>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    {type === 'approve' && <button className="btn btn-success" onClick={handleApprove}><CheckCircle size={15} /> Approve</button>}
                    {type === 'reject' && <button className="btn btn-danger" onClick={handleReject} disabled={!reason.trim()}><XCircle size={15} /> Reject</button>}
                    {type === 'reschedule' && <button className="btn btn-warning" onClick={handleReschedule} disabled={!newDate || !newTime || !reason.trim()}><RefreshCw size={15} /> Propose</button>}
                </div>
            </div>
        </div>
    );
}

const urgencyIcon = { Routine: null, Urgent: <AlertTriangle size={13} color="#d97706" />, Emergency: <AlertTriangle size={13} color="#dc2626" /> };

export default function AppointmentRequests() {
    const { currentUser } = useSelector(s => s.auth);
    const appointments = useSelector(s => s.appointments.list);
    const [activeTab, setActiveTab] = useState('pending');
    const [modal, setModal] = useState(null); // { type: 'approve'|'reject'|'reschedule', apt }
    const [selected, setSelected] = useState(null);

    const myApts = appointments.filter(a => a.doctorId === currentUser?.doctorId);
    const tabs = [
        { key: 'pending', label: 'Pending Requests', apts: myApts.filter(a => a.status === 'pending') },
        { key: 'approved', label: 'Approved', apts: myApts.filter(a => a.status === 'approved') },
        { key: 'rejected', label: 'Rejected', apts: myApts.filter(a => a.status === 'rejected') },
        { key: 'all', label: 'All', apts: myApts },
    ];
    const activeApts = tabs.find(t => t.key === activeTab)?.apts || [];

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Appointment Requests</h2>
                    <p>{myApts.filter(a => a.status === 'pending').length} pending requests require your action</p>
                </div>
            </div>

            <div className="tabs">
                {tabs.map(t => (
                    <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                        {t.label} <span className="tab-count">{t.apts.length}</span>
                    </button>
                ))}
            </div>

            {activeApts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No {activeTab} appointments</h3>
                    <p>Appointment requests will appear here when patients submit them.</p>
                </div>
            ) : (
                activeApts.map(apt => (
                    <div key={apt.id} className="apt-card">
                        <div className="apt-card-header">
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div className="apt-card-title">{apt.patientName}</div>
                                    <span className={`badge badge-${apt.urgency?.toLowerCase()}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {urgencyIcon[apt.urgency]} {apt.urgency}
                                    </span>
                                </div>
                                <div className="apt-card-sub">{apt.appointmentNumber} · {apt.visitType}</div>
                            </div>
                            <span className={`badge badge-${apt.status}`}>{apt.status.toUpperCase()}</span>
                        </div>

                        <div className="apt-card-meta">
                            <div className="apt-meta-item"><Calendar size={13} />{apt.date}</div>
                            <div className="apt-meta-item"><Clock size={13} />{apt.time}</div>
                            <div className="apt-meta-item"><User size={13} />{apt.department}</div>
                        </div>

                        <div style={{ background: 'var(--bg-main)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>REASON FOR VISIT</div>
                            <div style={{ fontSize: '0.875rem' }}>{apt.reason}</div>
                            {apt.symptoms && (
                                <div style={{ marginTop: 6 }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>SYMPTOMS: </span>
                                    <span style={{ fontSize: '0.82rem' }}>{apt.symptoms}</span>
                                </div>
                            )}
                        </div>

                        {apt.notes && (
                            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 12, padding: '8px 10px', background: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                                <MessageSquare size={13} color="#059669" style={{ marginTop: 2 }} />
                                <div style={{ fontSize: '0.82rem', color: '#065f46' }}>{apt.notes}</div>
                            </div>
                        )}

                        {apt.rejectionReason && (
                            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 12, padding: '8px 10px', background: '#fff1f2', borderRadius: 6, border: '1px solid #fca5a5' }}>
                                <XCircle size={13} color="#dc2626" style={{ marginTop: 2 }} />
                                <div style={{ fontSize: '0.82rem', color: '#991b1b' }}>Rejection reason: {apt.rejectionReason}</div>
                            </div>
                        )}

                        {apt.status === 'pending' && (
                            <div className="apt-card-actions">
                                <button className="btn btn-success btn-sm" onClick={() => setModal({ type: 'approve', apt })}><CheckCircle size={14} /> Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => setModal({ type: 'reject', apt })}><XCircle size={14} /> Reject</button>
                                <button className="btn btn-warning btn-sm" onClick={() => setModal({ type: 'reschedule', apt })}><RefreshCw size={14} /> Reschedule</button>
                            </div>
                        )}
                    </div>
                ))
            )}

            {modal && <ActionModal type={modal.type} appointment={modal.apt} onClose={() => setModal(null)} />}
        </div>
    );
}

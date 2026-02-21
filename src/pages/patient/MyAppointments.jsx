import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cancelAppointment, addReview } from '../../slices/appointmentsSlice';
import { X, Star } from 'lucide-react';
import { useToast } from '../../components/Toast';

function ReviewModal({ apt, onClose }) {
    const dispatch = useDispatch();
    const toast = useToast();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const handleSubmit = () => {
        if (!rating) return;
        dispatch(reviewAppointment({ id: apt.id, rating, review }));
        toast({ type: 'success', title: 'Review Submitted!', message: 'Thank you for your feedback.' });
        onClose();
    };
    return (
        <div className="modal-overlay">
            <div className="modal modal-sm">
                <div className="modal-header">
                    <h2>Rate Doctor</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <p style={{ marginBottom: 12 }}>How was your experience with <strong>{apt.doctorName}</strong>?</p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                            <Star key={n} size={32} fill={n <= rating ? '#f59e0b' : 'none'} color={n <= rating ? '#f59e0b' : '#d1d5db'} style={{ cursor: 'pointer' }} onClick={() => setRating(n)} />
                        ))}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Write a Review (optional)</label>
                        <textarea className="form-control" rows={3} value={review} onChange={e => setReview(e.target.value)} placeholder="Share your experience..." />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" disabled={!rating} onClick={handleSubmit}>Submit Review</button>
                </div>
            </div>
        </div>
    );
}

const STATUS_TABS = ['all', 'pending', 'approved', 'completed', 'rejected', 'cancelled'];

export default function MyAppointments() {
    const { currentUser } = useSelector(s => s.auth);
    const appointments = useSelector(s => s.appointments.list);
    const dispatch = useDispatch();
    const toast = useToast();
    const [tab, setTab] = useState('all');
    const [reviewApt, setReviewApt] = useState(null);

    const myApts = appointments.filter(a => a.patientId === currentUser?.patientId)
        .sort((a, b) => b.date.localeCompare(a.date));
    const filtered = tab === 'all' ? myApts : myApts.filter(a => a.status === tab);

    const handleCancel = (apt) => {
        if (window.confirm(`Cancel appointment with ${apt.doctorName} on ${apt.date}?`)) {
            dispatch(cancelAppointment({ id: apt.id }));
            toast({ type: 'info', title: 'Appointment Cancelled', message: `Your appointment on ${apt.date} has been cancelled.` });
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>My Appointments</h2>
                    <p>{myApts.length} total appointments</p>
                </div>
            </div>

            <div className="tabs" style={{ marginBottom: 20 }}>
                {STATUS_TABS.map(t => {
                    const count = t === 'all' ? myApts.length : myApts.filter(a => a.status === t).length;
                    return (
                        <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
                            {t} {count > 0 && <span className="tab-count">{count}</span>}
                        </button>
                    );
                })}
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <h3>No {tab} appointments</h3>
                </div>
            ) : filtered.map(apt => (
                <div key={apt.id} className="apt-card">
                    <div className="apt-card-header">
                        <div>
                            <div className="apt-card-title">{apt.doctorName}</div>
                            <div className="apt-card-sub">{apt.department} · {apt.appointmentNumber}</div>
                        </div>
                        <span className={`badge badge-${apt.status}`}>{apt.status.toUpperCase()}</span>
                    </div>
                    <div className="apt-card-meta">
                        <div className="apt-meta-item">📅 {apt.date}</div>
                        <div className="apt-meta-item">🕐 {apt.time}</div>
                        <div className="apt-meta-item">🏷️ {apt.visitType}</div>
                        <div className="apt-meta-item">🚨 {apt.urgency}</div>
                        <div className="apt-meta-item">₹ ₹{apt.fee}</div>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                        <strong>Reason:</strong> {apt.reason?.slice(0, 120)}
                    </div>
                    {apt.notes && (
                        <div style={{ background: '#f0fdf4', borderRadius: 6, padding: '8px 12px', fontSize: '0.8rem', color: '#065f46', marginBottom: 8 }}>
                            📝 Doctor's note: {apt.notes}
                        </div>
                    )}
                    {apt.rejectionReason && (
                        <div style={{ background: '#fff1f2', borderRadius: 6, padding: '8px 12px', fontSize: '0.8rem', color: '#991b1b', marginBottom: 8 }}>
                            ❌ Rejection reason: {apt.rejectionReason}
                        </div>
                    )}
                    {apt.rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                            {[1, 2, 3, 4, 5].map(n => <Star key={n} size={14} fill={n <= apt.rating ? '#f59e0b' : 'none'} color={n <= apt.rating ? '#f59e0b' : '#d1d5db'} />)}
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 6 }}>{apt.review}</span>
                        </div>
                    )}
                    <div className="apt-card-actions">
                        {(apt.status === 'pending' || apt.status === 'approved') && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(apt)}>Cancel</button>
                        )}
                        {apt.status === 'completed' && !apt.rating && (
                            <button className="btn btn-warning btn-sm" onClick={() => setReviewApt(apt)}>
                                <Star size={14} /> Rate Doctor
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {reviewApt && <ReviewModal apt={reviewApt} onClose={() => setReviewApt(null)} />}
        </div>
    );
}

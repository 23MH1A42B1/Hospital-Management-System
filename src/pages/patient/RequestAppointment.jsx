import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Star, ChevronRight, ChevronLeft, Calendar, Clock, FileText, AlertTriangle } from 'lucide-react';
import { addAppointment } from '../../slices/appointmentsSlice';
import { addNotification } from '../../slices/notificationsSlice';
import { MOCK_USERS, DEPARTMENTS } from '../../data/mockData';
import { useToast } from '../../components/Toast';

function StarRating({ value, onChange }) {
    return (
        <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={24} fill={n <= value ? '#f59e0b' : 'none'} color={n <= value ? '#f59e0b' : '#d1d5db'} style={{ cursor: 'pointer' }} onClick={() => onChange(n)} />
            ))}
        </div>
    );
}

const VISIT_TYPES = ['First Visit', 'Follow-up', 'Consultation'];
const URGENCY_LEVELS = ['Routine', 'Urgent', 'Emergency'];

export default function RequestAppointment() {
    const { currentUser } = useSelector(s => s.auth);
    const doctors = useSelector(s => s.doctors.list);
    const patients = useSelector(s => s.patients.list);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const patient = patients.find(p => p.id === currentUser?.patientId);

    const [step, setStep] = useState(1);
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [form, setForm] = useState({ date: '', time: '', visitType: 'First Visit', urgency: 'Routine', reason: '', symptoms: '', notes: '' });
    const [confirmed, setConfirmed] = useState(null);

    const deptDoctors = doctors.filter(d => d.department === selectedDept);
    const set = (f, v) => setForm(x => ({ ...x, [f]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.reason || form.reason.length < 10) return;

        const apt = {
            patientId: currentUser?.patientId,
            patientName: currentUser?.name,
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            department: selectedDoctor.department,
            ...form,
            fee: selectedDoctor.consultationFee,
        };

        dispatch(addAppointment(apt));

        // Find and notify the doctor
        const doctorUser = MOCK_USERS.find(u => u.doctorId === selectedDoctor.id);
        if (doctorUser) {
            dispatch(addNotification({
                userId: doctorUser.id,
                type: 'appointment_request',
                title: '📋 New Appointment Request',
                message: `${currentUser?.name} has requested an appointment for ${form.date} at ${form.time}. Urgency: ${form.urgency}`,
                appointmentId: null,
            }));
        }

        toast({ type: 'success', title: 'Appointment Requested!', message: 'Your request has been sent to the doctor for approval.' });
        setConfirmed({ ...apt, appointmentNumber: `APT-2024-${Math.floor(100000 + Math.random() * 900000)}` });
        setStep(4);
    };

    if (step === 4 && confirmed) {
        return (
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', background: '#fff', borderRadius: 'var(--radius-xl)', padding: '40px 32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                    <div style={{ width: 64, height: 64, background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <CheckCircle size={32} color="#059669" />
                    </div>
                    <h2 style={{ marginBottom: 8 }}>Appointment Request Sent!</h2>
                    <p style={{ marginBottom: 24 }}>Your request has been sent to {selectedDoctor?.name} for approval.</p>
                    <div style={{ background: 'var(--primary-light)', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>APPOINTMENT NUMBER</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{confirmed.appointmentNumber}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left', marginBottom: 28 }}>
                        {[['Doctor', confirmed.doctorName], ['Department', confirmed.department], ['Date', confirmed.date], ['Time', confirmed.time], ['Type', confirmed.visitType], ['Status', 'PENDING']].map(([l, v]) => (
                            <div key={l} style={{ background: 'var(--bg-main)', padding: '10px 14px', borderRadius: 8 }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{l}</div>
                                <div style={{ fontWeight: 700, marginTop: 2, color: v === 'PENDING' ? 'var(--warning)' : undefined }}>{v}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#fef3c7', borderRadius: 8, padding: '10px 14px', marginBottom: 24, fontSize: '0.82rem', color: '#92400e' }}>
                        ⏳ You will be notified via in-app notification once the doctor approves or rejects your request.
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/patient/appointments')}>View My Appointments</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Book an Appointment</h2>
                    <p>Step {step} of 3</p>
                </div>
            </div>

            {/* Step Progress */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
                {['Select Department', 'Choose Doctor', 'Fill Details'].map((label, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {i > 0 && <div style={{ flex: 1, height: 2, background: step > i ? 'var(--primary)' : 'var(--border)' }} />}
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i ? 'var(--primary)' : step === i + 1 ? 'var(--primary)' : 'var(--border)', color: step >= i + 1 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                                {step > i + 1 ? '✓' : i + 1}
                            </div>
                            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? 'var(--primary)' : 'var(--border)' }} />}
                        </div>
                        <div style={{ fontSize: '0.75rem', marginTop: 6, color: step === i + 1 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: step === i + 1 ? 600 : 400 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Step 1 — Department */}
            {step === 1 && (
                <div className="card">
                    <h3 style={{ marginBottom: 20 }}>Select Department</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {DEPARTMENTS.map(dept => (
                            <div key={dept} onClick={() => setSelectedDept(dept)}
                                style={{ padding: '16px', borderRadius: 'var(--radius)', border: `2px solid ${selectedDept === dept ? 'var(--primary)' : 'var(--border)'}`, background: selectedDept === dept ? 'var(--primary-light)' : '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontWeight: 600, fontSize: '0.875rem', color: selectedDept === dept ? 'var(--primary)' : 'var(--text-primary)' }}>
                                {dept}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                        <button className="btn btn-primary" disabled={!selectedDept} onClick={() => setStep(2)}>
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2 — Doctor */}
            {step === 2 && (
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}><ChevronLeft size={16} /> Back</button>
                        <h3>Choose Doctor in {selectedDept}</h3>
                    </div>
                    {deptDoctors.length === 0 ? (
                        <div className="empty-state"><p>No doctors available in this department right now.</p></div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {deptDoctors.map(doc => (
                                <div key={doc.id} className={`doctor-card ${selectedDoctor?.id === doc.id ? 'selected' : ''}`} onClick={() => setSelectedDoctor(doc)}>
                                    <div className="doctor-card-header">
                                        <div className="avatar avatar-lg avatar-teal">{doc.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                                        <div style={{ flex: 1 }}>
                                            <div className="doctor-card-name">{doc.name}</div>
                                            <div className="doctor-card-spec">{doc.specialization} · {doc.experience} years exp</div>
                                            <div style={{ marginTop: 4 }}>
                                                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem' }}>⭐ {doc.rating}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: 8 }}>{doc.totalPatients.toLocaleString()} patients</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{doc.consultationFee}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>consultation</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>AVAILABLE SLOTS</div>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {doc.availableSlots.map(slot => (
                                                <span key={slot} style={{ padding: '3px 10px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>{slot}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                        <button className="btn btn-primary" disabled={!selectedDoctor} onClick={() => setStep(3)}>
                            Continue <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3 — Details */}
            {step === 3 && (
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(2)}><ChevronLeft size={16} /> Back</button>
                            <h3>Appointment Details</h3>
                        </div>

                        <div style={{ background: 'var(--primary-light)', padding: '12px 16px', borderRadius: 10, marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <div className="avatar avatar-sm avatar-teal">{selectedDoctor?.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedDoctor?.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{selectedDoctor?.specialization} · ₹{selectedDoctor?.consultationFee}</div>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label"><Calendar size={13} /> Preferred Date <span className="required">*</span></label>
                                <input type="date" className="form-control" value={form.date} onChange={e => set('date', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label"><Clock size={13} /> Preferred Time <span className="required">*</span></label>
                                <select className="form-control" value={form.time} onChange={e => set('time', e.target.value)} required>
                                    <option value="">Select time</option>
                                    {selectedDoctor?.availableSlots.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Visit Type</label>
                                <select className="form-control" value={form.visitType} onChange={e => set('visitType', e.target.value)}>
                                    {VISIT_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Urgency Level</label>
                                <select className="form-control" value={form.urgency} onChange={e => set('urgency', e.target.value)}>
                                    {URGENCY_LEVELS.map(u => <option key={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label"><FileText size={13} /> Reason for Visit <span className="required">*</span> <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(min 10 chars)</span></label>
                            <textarea className="form-control" rows={3} value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="Please describe why you'd like to see the doctor..." required minLength={10} />
                            {form.reason.length > 0 && form.reason.length < 10 && <div className="form-error">Please provide at least 10 characters</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Current Symptoms</label>
                            <input className="form-control" value={form.symptoms} onChange={e => set('symptoms', e.target.value)} placeholder="E.g. Headache, fever, chest pain..." />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Notes (optional)</label>
                            <textarea className="form-control" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any other information you'd like to share..." />
                        </div>

                        {form.urgency === 'Emergency' && (
                            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                                <AlertTriangle size={16} color="#dc2626" />
                                <div style={{ fontSize: '0.82rem', color: '#991b1b' }}>For medical emergencies, please call 108 or visit the emergency ward immediately.</div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={!form.reason || form.reason.length < 10}>
                            Submit Appointment Request
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pill, Check, X, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { addMAREntry } from '../../../slices/nurseSlice';
import { useToast } from '../../../components/Toast';

const ROUTE_COLORS = { 'IV': 'blue', 'Oral': 'green', 'Nebulizer': 'purple', 'IM': 'orange', 'SC': 'orange', 'Topical': 'teal' };

const now = new Date();
const currentHour = now.getHours();

export default function MedicationAdmin() {
    const patients = useSelector(s => s.nurse.patients);
    const marEntries = useSelector(s => s.nurse.mar);
    const { currentUser } = useSelector(s => s.auth);
    const dispatch = useDispatch();
    const toast = useToast();
    const today = now.toISOString().split('T')[0];

    const [selectedPatient, setSelectedPatient] = useState(patients[0]);
    const [showModal, setShowModal] = useState(false);
    const [modalMed, setModalMed] = useState(null);
    const [modalForm, setModalForm] = useState({ given: true, refusalReason: '', held: false, heldReason: '', response: 'normal', notes: '' });

    const isGiven = (patientId, medId, time) => marEntries.some(m => m.patientId === patientId && m.medicineId === medId && m.time === time && m.date === today);

    const openModal = (med, time) => {
        setModalMed({ med, time });
        setModalForm({ given: true, refusalReason: '', held: false, heldReason: '', response: 'normal', notes: '' });
        setShowModal(true);
    };

    const submitAdmin = () => {
        dispatch(addMAREntry({
            id: `mar${Date.now()}`,
            patientId: selectedPatient.id,
            medicineId: modalMed.med.id,
            medicineName: modalMed.med.name,
            time: modalMed.time,
            date: today,
            given: modalForm.given,
            refusedBy: !modalForm.given ? 'Patient' : undefined,
            refusalReason: !modalForm.given ? modalForm.refusalReason : undefined,
            held: modalForm.held,
            heldReason: modalForm.held ? modalForm.heldReason : undefined,
            givenBy: currentUser?.name || 'Nurse',
            patientResponse: modalForm.response,
            notes: modalForm.notes,
        }));
        toast({ type: 'success', title: 'MAR Updated', message: `${modalMed.med.name} at ${modalMed.time}` });
        setShowModal(false);
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Medication Administration</h2>
                    <p>MAR — Medication Administration Record</p>
                </div>
            </div>

            {/* Patient selector */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                {patients.map(p => (
                    <div key={p.id} onClick={() => setSelectedPatient(p)} style={{ padding: '10px 20px', border: `2px solid ${selectedPatient?.id === p.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', background: selectedPatient?.id === p.id ? 'var(--primary-light)' : 'transparent', transition: 'all 0.15s' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.bedId} · {p.status}</div>
                    </div>
                ))}
            </div>

            {selectedPatient && (
                <>
                    {/* Allergy banner */}
                    {selectedPatient.allergies.length > 0 && (
                        <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                            <AlertCircle size={16} color="#dc2626" />
                            <strong style={{ color: '#dc2626' }}>Allergies:</strong>
                            {selectedPatient.allergies.map(a => <span key={a} style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 20, padding: '2px 10px', fontWeight: 500, fontSize: '0.82rem' }}>⚠️ {a}</span>)}
                        </div>
                    )}

                    {/* Medications */}
                    {selectedPatient.medications.map(med => {
                        const routeColor = ROUTE_COLORS[med.route] || 'gray';
                        return (
                            <div key={med.id} className="card" style={{ marginBottom: 16, padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div style={{ display: 'flex', gap: 14 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Pill size={20} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{med.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                <span style={{ background: `var(--${routeColor === 'blue' ? 'info' : routeColor}-light, var(--bg-secondary))`, color: `var(--${routeColor === 'blue' ? 'info' : routeColor}, var(--primary))`, borderRadius: 6, padding: '1px 8px', fontWeight: 600 }}>{med.route}</span>
                                                <span style={{ margin: '0 8px' }}>·</span>{med.frequency}
                                                <span style={{ margin: '0 8px' }}>·</span>For: {med.indication}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ background: med.status === 'active' ? 'var(--success-light)' : 'var(--bg-secondary)', color: med.status === 'active' ? 'var(--success)' : 'var(--text-muted)', borderRadius: 20, padding: '3px 12px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize' }}>{med.status}</span>
                                </div>

                                {/* Time slots */}
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    {med.times.map(time => {
                                        const given = isGiven(selectedPatient.id, med.id, time);
                                        const [h, m] = time.split(':').map(Number);
                                        const isPast = h < currentHour || (h === currentHour && m <= now.getMinutes());
                                        const isCurrent = h === currentHour || h === currentHour + 1;
                                        return (
                                            <div key={time} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{time}</div>
                                                <button
                                                    onClick={() => !given && openModal(med, time)}
                                                    disabled={given}
                                                    style={{
                                                        width: 52, height: 52, borderRadius: 12, border: 'none', cursor: given ? 'default' : 'pointer',
                                                        background: given ? 'var(--success-light)' : isCurrent ? 'var(--warning-light)' : isPast ? '#fee2e2' : 'var(--bg-secondary)',
                                                        color: given ? 'var(--success)' : isCurrent ? 'var(--warning)' : isPast ? 'var(--danger)' : 'var(--text-muted)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                                                        boxShadow: isCurrent && !given ? '0 0 0 2px var(--warning)' : 'none',
                                                    }}
                                                    title={given ? 'Already administered' : `Mark as given at ${time}`}
                                                >
                                                    {given ? <CheckCircle size={22} /> : isPast ? <AlertCircle size={22} /> : <Clock size={22} />}
                                                </button>
                                                <div style={{ fontSize: '0.68rem', color: given ? 'var(--success)' : isPast ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 600 }}>
                                                    {given ? 'Given' : isPast ? 'Overdue' : 'Pending'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}

            {/* Admin Modal */}
            {showModal && modalMed && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div className="card" style={{ width: 460, padding: 28 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Administer Medication</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{modalMed.med.name} · {modalMed.time}</p>

                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label">Administration Status</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[{ val: true, label: '✅ Given', color: 'success' }, { val: false, label: '❌ Not Given', color: 'danger' }].map(opt => (
                                    <label key={String(opt.val)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: `2px solid ${modalForm.given === opt.val ? `var(--${opt.color})` : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: modalForm.given === opt.val ? `var(--${opt.color}-light)` : 'transparent', fontWeight: modalForm.given === opt.val ? 600 : 400 }}>
                                        <input type="radio" hidden checked={modalForm.given === opt.val} onChange={() => setModalForm(f => ({ ...f, given: opt.val }))} />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {!modalForm.given && (
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label">Reason Not Given</label>
                                <input className="form-input" placeholder="e.g. Patient refused, NPO, Held by doctor order..." value={modalForm.refusalReason} onChange={e => setModalForm(f => ({ ...f, refusalReason: e.target.value }))} />
                            </div>
                        )}

                        {modalForm.given && (
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label">Patient Response</label>
                                <select className="form-input" value={modalForm.response} onChange={e => setModalForm(f => ({ ...f, response: e.target.value }))}>
                                    <option value="normal">Normal — Tolerated well</option>
                                    <option value="nausea">Nausea / Vomiting</option>
                                    <option value="rash">Skin Rash</option>
                                    <option value="hypotension">Hypotension</option>
                                    <option value="allergic">Allergic reaction — NOTIFY DOCTOR</option>
                                </select>
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="form-label">Notes (optional)</label>
                            <textarea className="form-input" rows={2} placeholder="Site, route details, patient comments..." value={modalForm.notes} onChange={e => setModalForm(f => ({ ...f, notes: e.target.value }))} />
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}><X size={14} /> Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={submitAdmin}><Check size={14} /> Confirm Administration</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Activity, Heart, Thermometer, Wind, Droplets, AlertCircle, Plus, Save } from 'lucide-react';
import { recordVitals, addNursingNote } from '../../../slices/nurseSlice';
import { useToast } from '../../../components/Toast';

const PAIN_COLORS = (p) => p >= 8 ? 'var(--danger)' : p >= 5 ? 'var(--warning)' : 'var(--success)';
const PAIN_EMOJI = (p) => p >= 8 ? '😫' : p >= 5 ? '😟' : p >= 3 ? '😐' : '🙂';

export default function VitalsRecording() {
    const { patientId } = useParams();
    const patients = useSelector(s => s.nurse.patients);
    const { currentUser } = useSelector(s => s.auth);
    const dispatch = useDispatch();
    const toast = useToast();

    const patient = patients.find(p => p.id === patientId) || patients[0];
    const [activeTab, setActiveTab] = useState('vitals');

    // Vitals form
    const [vitalsForm, setVitalsForm] = useState({ bp: '', hr: '', temp: '', spo2: '', rr: '', pain: 5, weight: '' });
    const [vErrors, setVErrors] = useState({});

    // Nursing note
    const [noteText, setNoteText] = useState('');

    if (!patient) return <div className="empty-state"><p>Patient not found</p></div>;

    const setV = (k, v) => setVitalsForm(f => ({ ...f, [k]: v }));

    const validateVitals = () => {
        const e = {};
        if (!vitalsForm.bp) e.bp = 'Required';
        if (!vitalsForm.hr) e.hr = 'Required';
        if (!vitalsForm.temp) e.temp = 'Required';
        if (!vitalsForm.spo2) e.spo2 = 'Required';
        setVErrors(e);
        return Object.keys(e).length === 0;
    };

    const submitVitals = () => {
        if (!validateVitals()) { toast({ type: 'warning', title: 'Incomplete', message: 'Please fill required vitals' }); return; }
        const now = new Date();
        dispatch(recordVitals({
            patientId: patient.id,
            vitals: {
                time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                bp: vitalsForm.bp, hr: Number(vitalsForm.hr), temp: Number(vitalsForm.temp),
                spo2: Number(vitalsForm.spo2), rr: Number(vitalsForm.rr) || null, pain: vitalsForm.pain,
                recorded: now.toISOString(),
            }
        }));
        toast({ type: 'success', title: 'Vitals Recorded', message: `Saved for ${patient.name}` });
        setVitalsForm({ bp: '', hr: '', temp: '', spo2: '', rr: '', pain: 5, weight: '' });
        setVErrors({});
    };

    const submitNote = () => {
        if (!noteText.trim()) { toast({ type: 'warning', title: 'Empty Note', message: 'Please enter a nursing note' }); return; }
        dispatch(addNursingNote({ patientId: patient.id, note: noteText, nurseName: currentUser?.name || 'Nurse' }));
        toast({ type: 'success', title: 'Note Added', message: 'Nursing note saved' });
        setNoteText('');
    };

    const latest = patient.vitalsHistory[patient.vitalsHistory.length - 1];
    const prev = patient.vitalsHistory[patient.vitalsHistory.length - 2];

    const trend = (curr, prevVal, lower = false) => {
        if (!prevVal) return null;
        const diff = curr - prevVal;
        if (Math.abs(diff) < 1) return '→';
        const improving = lower ? diff < 0 : diff > 0;
        return diff > 0 ? `↑ +${diff.toFixed(1)}` : `↓ ${diff.toFixed(1)}`;
    };

    const VITAL_CARDS = [
        { icon: Heart, label: 'Heart Rate', key: 'hr', unit: 'bpm', normal: '60–100', warning: v => v > 100 || v < 60, color: 'red' },
        { icon: Activity, label: 'Blood Pressure', key: 'bp', unit: 'mmHg', normal: '90–140/60–90', warning: () => false, color: 'blue' },
        { icon: Thermometer, label: 'Temperature', key: 'temp', unit: '°F', normal: '97–99°F', warning: v => v > 100, color: 'orange' },
        { icon: Droplets, label: 'SpO₂', key: 'spo2', unit: '%', normal: '≥ 95%', warning: v => v < 94, color: 'purple' },
        { icon: Wind, label: 'Resp Rate', key: 'rr', unit: '/min', normal: '12–20', warning: v => v > 20, color: 'green' },
        { icon: AlertCircle, label: 'Pain Score', key: 'pain', unit: '/10', normal: '< 4', warning: v => v >= 7, color: 'red' },
    ];

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f87171', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {patient.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <h2>{patient.name}</h2>
                            <p>{patient.bedId} · {patient.ward} · {patient.diagnosis}</p>
                        </div>
                        <span style={{ background: patient.status === 'critical' ? 'var(--danger)' : 'var(--success)', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', marginLeft: 8 }}>{patient.status}</span>
                    </div>
                </div>
            </div>

            {/* Allergy banner */}
            {patient.allergies.length > 0 && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} color="#dc2626" />
                    <strong style={{ color: '#dc2626' }}>Known Allergies:</strong>
                    {patient.allergies.map(a => <span key={a} style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 20, padding: '1px 10px', fontWeight: 500, fontSize: '0.83rem' }}>{a}</span>)}
                </div>
            )}

            {/* Latest vitals overview */}
            {latest && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
                    {VITAL_CARDS.map(({ icon: Icon, label, key, unit, normal, warning, color }) => {
                        const val = latest[key];
                        const isWarning = typeof val === 'number' && warning(val);
                        return (
                            <div key={key} className={`kpi-card ${isWarning ? 'red' : color}`} style={{ position: 'relative', overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isWarning ? 'var(--danger)' : 'var(--text)' }}>
                                    {key === 'pain' ? PAIN_EMOJI(val) : val}{' '}
                                    <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>{unit}</span>
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Normal: {normal}</div>
                                {isWarning && <div style={{ position: 'absolute', top: 6, right: 6, background: 'var(--danger)', color: '#fff', borderRadius: 20, padding: '1px 6px', fontSize: '0.65rem', fontWeight: 700 }}>ALERT</div>}
                            </div>
                        );
                    })}
                </div>
            )}

            <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border)', marginBottom: 24 }}>
                {['vitals', 'history', 'notes'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '8px 20px', border: 'none', background: 'none', cursor: 'pointer',
                        fontWeight: activeTab === tab ? 700 : 400,
                        color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                        borderBottom: `2px solid ${activeTab === tab ? 'var(--primary)' : 'transparent'}`,
                        marginBottom: -2, textTransform: 'capitalize', transition: 'all 0.15s',
                    }}>
                        {tab === 'vitals' ? '📋 Record Vitals' : tab === 'history' ? '📊 History' : '📝 Nursing Notes'}
                    </button>
                ))}
            </div>

            {/* Record Vitals Tab */}
            {activeTab === 'vitals' && (
                <div className="card" style={{ padding: 28 }}>
                    <div className="card-title" style={{ marginBottom: 20 }}>Record New Vitals</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                        <div className="form-group">
                            <label className="form-label">Blood Pressure (mmHg) *</label>
                            <input className={`form-input ${vErrors.bp ? 'error' : ''}`} placeholder="e.g. 120/80" value={vitalsForm.bp} onChange={e => setV('bp', e.target.value)} />
                            {vErrors.bp && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{vErrors.bp}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Heart Rate (bpm) *</label>
                            <input type="number" className={`form-input ${vErrors.hr ? 'error' : ''}`} placeholder="72" value={vitalsForm.hr} onChange={e => setV('hr', e.target.value)} />
                            {vErrors.hr && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{vErrors.hr}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Temperature (°F) *</label>
                            <input type="number" step="0.1" className={`form-input ${vErrors.temp ? 'error' : ''}`} placeholder="98.6" value={vitalsForm.temp} onChange={e => setV('temp', e.target.value)} />
                            {vErrors.temp && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{vErrors.temp}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">SpO₂ (%) *</label>
                            <input type="number" className={`form-input ${vErrors.spo2 ? 'error' : ''}`} placeholder="97" value={vitalsForm.spo2} onChange={e => setV('spo2', e.target.value)} />
                            {vErrors.spo2 && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{vErrors.spo2}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Respiratory Rate (/min)</label>
                            <input type="number" className="form-input" placeholder="16" value={vitalsForm.rr} onChange={e => setV('rr', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Weight (kg)</label>
                            <input type="number" className="form-input" placeholder="65" value={vitalsForm.weight} onChange={e => setV('weight', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: 8 }}>
                        <label className="form-label">Pain Score: <strong style={{ color: PAIN_COLORS(vitalsForm.pain) }}>{vitalsForm.pain}/10 {PAIN_EMOJI(vitalsForm.pain)}</strong></label>
                        <input type="range" min={0} max={10} value={vitalsForm.pain} onChange={e => setV('pain', Number(e.target.value))} style={{ width: '100%', accentColor: PAIN_COLORS(vitalsForm.pain) }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}><span>0 No Pain</span><span>5 Moderate</span><span>10 Worst</span></div>
                    </div>
                    <div style={{ marginTop: 24 }}>
                        <button className="btn btn-primary" onClick={submitVitals} style={{ padding: '10px 32px' }}>
                            <Save size={15} /> Save Vitals
                        </button>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="table-container">
                    <div className="table-header"><div style={{ fontWeight: 600 }}>Vitals History — {patient.name}</div></div>
                    <div className="table-responsive">
                        <table>
                            <thead><tr><th>Time</th><th>BP</th><th>Heart Rate</th><th>Temp</th><th>SpO₂</th><th>Resp Rate</th><th>Pain</th></tr></thead>
                            <tbody>
                                {[...patient.vitalsHistory].reverse().map((v, i) => (
                                    <tr key={i}>
                                        <td><strong>{v.time}</strong></td>
                                        <td>{v.bp}</td>
                                        <td style={{ color: v.hr > 100 || v.hr < 60 ? 'var(--danger)' : undefined, fontWeight: v.hr > 100 || v.hr < 60 ? 700 : undefined }}>{v.hr} bpm</td>
                                        <td style={{ color: v.temp > 100 ? 'var(--danger)' : undefined }}>{v.temp}°F</td>
                                        <td style={{ color: v.spo2 < 94 ? 'var(--danger)' : undefined, fontWeight: v.spo2 < 94 ? 700 : undefined }}>{v.spo2}%</td>
                                        <td>{v.rr ? `${v.rr} / min` : '—'}</td>
                                        <td><span style={{ color: PAIN_COLORS(v.pain), fontWeight: 600 }}>{v.pain}/10 {PAIN_EMOJI(v.pain)}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Nursing Notes Tab */}
            {activeTab === 'notes' && (
                <div>
                    <div className="card" style={{ marginBottom: 20, padding: 24 }}>
                        <div className="card-title" style={{ marginBottom: 12 }}>Add Nursing Note</div>
                        <textarea className="form-input" rows={4} placeholder="Enter your clinical observations, patient response, care provided, patient concerns, etc..." value={noteText} onChange={e => setNoteText(e.target.value)} style={{ resize: 'vertical' }} />
                        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={submitNote}>
                            <Plus size={14} /> Add Note
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[...patient.notes].reverse().map(n => (
                            <div key={n.id} className="card" style={{ padding: 18, background: 'var(--bg-secondary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{n.nurse}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.time}</span>
                                </div>
                                <p style={{ margin: 0, lineHeight: 1.6 }}>{n.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

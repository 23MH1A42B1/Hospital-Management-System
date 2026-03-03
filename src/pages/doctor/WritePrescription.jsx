import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FileText, Plus, X, Printer, Search } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { MOCK_MEDICINES } from '../../data/mockData';

const DOSAGE_FREQ = ['Once daily (OD)', 'Twice daily (BD)', 'Three times daily (TDS)', 'Four times daily (QID)', 'Every 8 hours', 'Every 6 hours', 'Once a week', 'As needed (PRN)', 'At night (HS)', 'Before meals', 'After meals'];
const DURATIONS = ['3 days', '5 days', '7 days', '10 days', '14 days', '1 month', '2 months', '3 months', 'Until review'];
const ROUTES = ['Oral', 'IV', 'IM', 'SC', 'Topical', 'Sublingual', 'Inhalation', 'Rectal'];

export default function WritePrescription() {
    const { currentUser } = useSelector(s => s.auth);
    const patients = useSelector(s => s.patients.list);
    const appointments = useSelector(s => s.appointments.list);
    const toast = useToast();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [medSearch, setMedSearch] = useState('');
    const [items, setItems] = useState([]);
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [saved, setSaved] = useState(false);
    const [rxNumber] = useState(() => `RX-2026-${String(Math.floor(Math.random() * 9000 + 1000))}`);

    const filteredPatients = patients.filter(p =>
        patientSearch && (p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.patientId.toLowerCase().includes(patientSearch.toLowerCase()))
    ).slice(0, 5);

    const filteredMeds = MOCK_MEDICINES.filter(m =>
        medSearch.length > 1 && (m.genericName.toLowerCase().includes(medSearch.toLowerCase()) || m.brandName.toLowerCase().includes(medSearch.toLowerCase()))
    ).slice(0, 6);

    const addMed = (med) => {
        if (items.find(i => i.id === med.id)) return;
        setItems(prev => [...prev, {
            id: med.id,
            medicineId: med.id,
            name: `${med.brandName} (${med.genericName} ${med.strength})`,
            form: med.form,
            route: med.form === 'Injection' ? 'IV' : 'Oral',
            dosage: '',
            frequency: 'Once daily (OD)',
            duration: '7 days',
            qty: 1,
            instruction: '',
            prescriptionRequired: med.prescriptionRequired,
        }]);
        setMedSearch('');
    };

    const updateItem = (id, key, val) => setItems(prev => prev.map(it => it.id === id ? { ...it, [key]: val } : it));
    const removeItem = (id) => setItems(prev => prev.filter(it => it.id !== id));

    const handleSave = () => {
        if (!selectedPatient) { toast({ type: 'warning', title: 'No Patient', message: 'Select a patient first' }); return; }
        if (items.length === 0) { toast({ type: 'warning', title: 'No Medicines', message: 'Add at least one medicine' }); return; }
        setSaved(true);
        toast({ type: 'success', title: 'Prescription Saved!', message: `Rx# ${rxNumber} for ${selectedPatient.name}` });
    };

    if (saved) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-left"><h2>Prescription</h2><p>#{rxNumber}</p></div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-outline" onClick={() => window.print()}><Printer size={15} /> Print</button>
                        <button className="btn btn-primary" onClick={() => { setSaved(false); setItems([]); setSelectedPatient(null); setPatientSearch(''); setDiagnosis(''); setClinicalNotes(''); }}>
                            <Plus size={14} /> New Prescription
                        </button>
                    </div>
                </div>
                {/* Prescription print view */}
                <div className="card" style={{ maxWidth: 700, margin: '0 auto', padding: 36 }}>
                    <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border)', paddingBottom: 20, marginBottom: 20 }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>MediCare Hospital & Research Centre</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>123, Hospital Road, Bengaluru — 560001 | Ph: 080-2345-6789</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                        <div style={{ fontSize: '0.88rem' }}>
                            <div><strong>Patient:</strong> {selectedPatient.name}</div>
                            <div><strong>ID:</strong> {selectedPatient.patientId}</div>
                            <div><strong>Age/Sex:</strong> {selectedPatient.age}y / {selectedPatient.gender}</div>
                            {selectedPatient.allergies?.length > 0 && <div style={{ color: 'var(--danger)', fontWeight: 600 }}>⚠️ Allergies: {selectedPatient.medicalHistory?.allergies?.join(', ')}</div>}
                        </div>
                        <div style={{ fontSize: '0.88rem', textAlign: 'right' }}>
                            <div><strong>Rx#:</strong> <span style={{ fontFamily: 'monospace' }}>{rxNumber}</span></div>
                            <div><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</div>
                            <div><strong>Doctor:</strong> {currentUser?.name}</div>
                            {followUpDate && <div><strong>Follow-up:</strong> {followUpDate}</div>}
                        </div>
                    </div>
                    {diagnosis && <div style={{ marginBottom: 16, padding: '10px 16px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.9rem' }}><strong>Diagnosis:</strong> {diagnosis}</div>}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontFamily: 'serif', fontSize: '2rem', color: 'var(--primary)', marginBottom: 8 }}>℞</div>
                        {items.map((item, idx) => (
                            <div key={item.id} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ fontWeight: 700 }}>{idx + 1}. {item.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.route} · {item.frequency} · {item.duration} · Qty: {item.qty}</div>
                                {item.dosage && <div style={{ fontSize: '0.82rem' }}>Dose: {item.dosage}</div>}
                                {item.instruction && <div style={{ fontSize: '0.82rem', fontStyle: 'italic' }}>Note: {item.instruction}</div>}
                            </div>
                        ))}
                    </div>
                    {clinicalNotes && <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}><strong>Clinical Notes:</strong><br />{clinicalNotes}</div>}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 150, borderTop: '1px solid var(--text)', paddingTop: 6, fontSize: '0.83rem', color: 'var(--text-muted)' }}>Doctor's Signature</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left"><h2>Write Prescription</h2><p>Digital prescription with medicine selection</p></div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--primary)', background: 'var(--primary-light)', padding: '6px 14px', borderRadius: 8 }}>Rx# {rxNumber}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="card">
                        <div className="card-title">Select Patient</div>
                        <div className="search-box" style={{ marginBottom: 8 }}>
                            <Search size={15} className="search-icon" />
                            <input placeholder="Name or Patient ID..." value={patientSearch} onChange={e => { setPatientSearch(e.target.value); setSelectedPatient(null); }} />
                        </div>
                        {filteredPatients.length > 0 && !selectedPatient && (
                            <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                                {filteredPatients.map(p => (
                                    <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(p.name); }} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.patientId} · {p.age}y</div></div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedPatient && (
                            <div style={{ padding: 14, background: 'var(--primary-light)', borderRadius: 10, fontSize: '0.88rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{selectedPatient.name}</div>
                                        <div style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>{selectedPatient.patientId} · {selectedPatient.age}y · {selectedPatient.bloodGroup}</div>
                                        {selectedPatient.medicalHistory?.allergies?.length > 0 && (
                                            <div style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.78rem', marginTop: 4 }}>⚠️ Allergies: {selectedPatient.medicalHistory.allergies.join(', ')}</div>
                                        )}
                                    </div>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setSelectedPatient(null); setPatientSearch(''); }}>✕</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="card-title">Clinical Info</div>
                        <div className="form-group">
                            <label className="form-label">Diagnosis / Chief Complaint</label>
                            <input className="form-input" placeholder="e.g. Hypertension, Type 2 Diabetes..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Clinical Notes</label>
                            <textarea className="form-input" rows={3} placeholder="Detailed notes, instructions, restrictions..." value={clinicalNotes} onChange={e => setClinicalNotes(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Follow-up Date</label>
                            <input type="date" className="form-input" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Right - medicines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="card">
                        <div className="card-title">Add Medicines</div>
                        <div className="search-box" style={{ marginBottom: 12 }}>
                            <Search size={15} className="search-icon" />
                            <input placeholder="Search by generic or brand name..." value={medSearch} onChange={e => setMedSearch(e.target.value)} />
                        </div>

                        {medSearch.length > 1 && filteredMeds.length > 0 && (
                            <div style={{ border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
                                {filteredMeds.map(m => (
                                    <div key={m.id} onClick={() => addMed(m)} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{m.brandName} ({m.genericName})</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.strength} · {m.form} · {m.category}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {m.prescriptionRequired && <div style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#dc2626', borderRadius: 20, padding: '1px 8px', marginBottom: 2 }}>Rx Required</div>}
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock: {m.currentStock}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {items.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                                <FileText size={28} style={{ opacity: 0.3, marginBottom: 8 }} />
                                <p style={{ margin: 0 }}>Search and add medicines above</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {items.map(item => (
                                    <div key={item.id} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12, position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>💊 {item.name}</span>
                                            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 0 }}><X size={16} /></button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                            <div className="form-group">
                                                <label className="form-label">Dosage</label>
                                                <input className="form-input" placeholder="e.g. 1 tablet / 10mg" value={item.dosage} onChange={e => updateItem(item.id, 'dosage', e.target.value)} style={{ fontSize: '0.82rem' }} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Route</label>
                                                <select className="form-input" value={item.route} onChange={e => updateItem(item.id, 'route', e.target.value)} style={{ fontSize: '0.82rem' }}>
                                                    {ROUTES.map(r => <option key={r}>{r}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Frequency</label>
                                                <select className="form-input" value={item.frequency} onChange={e => updateItem(item.id, 'frequency', e.target.value)} style={{ fontSize: '0.82rem' }}>
                                                    {DOSAGE_FREQ.map(f => <option key={f}>{f}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Duration</label>
                                                <select className="form-input" value={item.duration} onChange={e => updateItem(item.id, 'duration', e.target.value)} style={{ fontSize: '0.82rem' }}>
                                                    {DURATIONS.map(d => <option key={d}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Qty (strips/units)</label>
                                                <input type="number" className="form-input" min={1} value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} style={{ fontSize: '0.82rem' }} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Instructions</label>
                                                <input className="form-input" placeholder="Before/after meals, etc." value={item.instruction} onChange={e => updateItem(item.id, 'instruction', e.target.value)} style={{ fontSize: '0.82rem' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="btn btn-primary" style={{ padding: '12px', width: '100%', fontSize: '1rem' }} onClick={handleSave}>
                        <FileText size={16} /> Save Prescription
                    </button>
                </div>
            </div>
        </div>
    );
}

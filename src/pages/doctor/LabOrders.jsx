import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FlaskConical, Search, Plus, Check, Printer } from 'lucide-react';
import { useToast } from '../../components/Toast';

const TEST_CATALOG = [
    { id: 't1', category: 'Haematology', name: 'Complete Blood Count (CBC)', code: 'HEM-001', price: 400, turnaround: '4 hours', specimen: 'Blood (EDTA)' },
    { id: 't2', category: 'Haematology', name: 'Erythrocyte Sedimentation Rate (ESR)', code: 'HEM-002', price: 180, turnaround: '2 hours', specimen: 'Blood (EDTA)' },
    { id: 't3', category: 'Haematology', name: 'Peripheral Blood Smear', code: 'HEM-003', price: 300, turnaround: '6 hours', specimen: 'Blood (EDTA)' },
    { id: 't4', category: 'Biochemistry', name: 'Fasting Blood Glucose (FBS)', code: 'BIO-001', price: 150, turnaround: '2 hours', specimen: 'Blood (Serum)' },
    { id: 't5', category: 'Biochemistry', name: 'HbA1c (Glycated Hemoglobin)', code: 'BIO-002', price: 500, turnaround: '4 hours', specimen: 'Blood (EDTA)' },
    { id: 't6', category: 'Biochemistry', name: 'Lipid Profile', code: 'BIO-003', price: 600, turnaround: '4 hours', specimen: 'Blood (Serum)' },
    { id: 't7', category: 'Biochemistry', name: 'Liver Function Tests (LFT)', code: 'BIO-004', price: 800, turnaround: '6 hours', specimen: 'Blood (Serum)' },
    { id: 't8', category: 'Biochemistry', name: 'Kidney Function Tests (KFT/RFT)', code: 'BIO-005', price: 700, turnaround: '6 hours', specimen: 'Blood (Serum)' },
    { id: 't9', category: 'Biochemistry', name: 'Thyroid Profile (T3, T4, TSH)', code: 'BIO-006', price: 900, turnaround: '8 hours', specimen: 'Blood (Serum)' },
    { id: 't10', category: 'Biochemistry', name: 'Cardiac Enzymes (Troponin I, CK-MB)', code: 'BIO-007', price: 1200, turnaround: '2 hours', specimen: 'Blood (Serum)' },
    { id: 't11', category: 'Biochemistry', name: 'D-Dimer', code: 'BIO-008', price: 1500, turnaround: '4 hours', specimen: 'Blood (Citrate)' },
    { id: 't12', category: 'Microbiology', name: 'Blood Culture & Sensitivity', code: 'MIC-001', price: 1200, turnaround: '48–72 hours', specimen: 'Blood (Aerobic + Anaerobic)' },
    { id: 't13', category: 'Microbiology', name: 'Urine Culture & Sensitivity', code: 'MIC-002', price: 800, turnaround: '48 hours', specimen: 'Midstream urine' },
    { id: 't14', category: 'Microbiology', name: 'Sputum Culture', code: 'MIC-003', price: 700, turnaround: '48–72 hours', specimen: 'Sputum' },
    { id: 't15', category: 'Urine', name: 'Urine Routine & Microscopy', code: 'URN-001', price: 150, turnaround: '2 hours', specimen: 'Midstream urine' },
    { id: 't16', category: 'Urine', name: 'Urine 24h Protein', code: 'URN-002', price: 400, turnaround: '4 hours', specimen: '24-hr urine' },
    { id: 't17', category: 'Radiology', name: 'X-Ray Chest (PA View)', code: 'RAD-001', price: 500, turnaround: '30 mins', specimen: 'N/A' },
    { id: 't18', category: 'Radiology', name: 'X-Ray Knee (AP + Lateral)', code: 'RAD-002', price: 800, turnaround: '30 mins', specimen: 'N/A' },
    { id: 't19', category: 'Radiology', name: 'USG Abdomen & Pelvis', code: 'RAD-003', price: 1200, turnaround: '1 hour', specimen: 'N/A' },
    { id: 't20', category: 'Radiology', name: 'CT Scan Chest with Contrast', code: 'RAD-004', price: 5000, turnaround: '2 hours', specimen: 'N/A' },
    { id: 't21', category: 'Radiology', name: 'MRI Brain with Contrast', code: 'RAD-005', price: 9000, turnaround: '3 hours', specimen: 'N/A' },
    { id: 't22', category: 'Cardiology', name: '12-Lead ECG', code: 'CAR-001', price: 350, turnaround: '20 mins', specimen: 'N/A' },
    { id: 't23', category: 'Cardiology', name: 'Echocardiogram (Echo)', code: 'CAR-002', price: 2500, turnaround: '1 hour', specimen: 'N/A' },
    { id: 't24', category: 'Cardiology', name: 'Holter Monitor (24h)', code: 'CAR-003', price: 3500, turnaround: '24 hours', specimen: 'N/A' },
    { id: 't25', category: 'Pulmonology', name: 'Spirometry (PFT)', code: 'PUL-001', price: 800, turnaround: '1 hour', specimen: 'N/A' },
    { id: 't26', category: 'Pulmonology', name: 'Arterial Blood Gas (ABG)', code: 'PUL-002', price: 600, turnaround: '30 mins', specimen: 'Arterial blood' },
];

const CATEGORIES = [...new Set(TEST_CATALOG.map(t => t.category))];
const URGENCY_OPTS = ['Routine', 'Urgent (STAT)', 'Emergency'];

export default function LabOrders() {
    const patients = useSelector(s => s.patients.list);
    const { currentUser } = useSelector(s => s.auth);
    const toast = useToast();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [testSearch, setTestSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selected, setSelected] = useState([]);
    const [urgency, setUrgency] = useState('Routine');
    const [clinicalInfo, setClinicalInfo] = useState('');
    const [saved, setSaved] = useState(null);
    const [orderNumber] = useState(() => `LAB-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(Math.floor(Math.random() * 9000 + 1000))}`);

    const filteredPatients = patients.filter(p =>
        patientSearch && (p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.patientId.toLowerCase().includes(patientSearch.toLowerCase()))
    ).slice(0, 5);

    const filteredTests = TEST_CATALOG.filter(t =>
        (categoryFilter === 'all' || t.category === categoryFilter) &&
        (!testSearch || t.name.toLowerCase().includes(testSearch.toLowerCase()))
    );

    const toggleTest = (t) => {
        setSelected(prev => prev.find(s => s.id === t.id) ? prev.filter(s => s.id !== t.id) : [...prev, t]);
    };

    const totalCost = selected.reduce((s, t) => s + t.price, 0);

    const handleSubmit = () => {
        if (!selectedPatient) { toast({ type: 'warning', title: '', message: 'Select a patient' }); return; }
        if (selected.length === 0) { toast({ type: 'warning', title: '', message: 'Select at least one test' }); return; }
        setSaved({ patient: selectedPatient, tests: selected, urgency, clinicalInfo, orderNumber, date: new Date().toLocaleDateString('en-IN') });
        toast({ type: 'success', title: 'Lab Order Placed!', message: `${orderNumber} — ${selected.length} tests` });
    };

    if (saved) {
        return (
            <div>
                <div className="page-header">
                    <div className="page-header-left"><h2>Lab Order</h2><p>#{saved.orderNumber}</p></div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-outline" onClick={() => window.print()}><Printer size={14} /> Print</button>
                        <button className="btn btn-primary" onClick={() => { setSaved(null); setSelected([]); setSelectedPatient(null); setPatientSearch(''); }}><Plus size={14} /> New Order</button>
                    </div>
                </div>
                <div className="card" style={{ maxWidth: 620, margin: '0 auto', padding: 32 }}>
                    <div style={{ textAlign: 'center', marginBottom: 20, borderBottom: '2px solid var(--border)', paddingBottom: 16 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>MediCare — Laboratory Requisition</div>
                        <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Order #: {saved.orderNumber}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20, fontSize: '0.88rem' }}>
                        <div><strong>Patient:</strong> {saved.patient.name}</div>
                        <div><strong>ID:</strong> {saved.patient.patientId}</div>
                        <div><strong>Ordered by:</strong> {currentUser?.name}</div>
                        <div><strong>Date:</strong> {saved.date}</div>
                        <div><strong>Urgency:</strong> <span style={{ color: saved.urgency !== 'Routine' ? 'var(--danger)' : 'inherit', fontWeight: saved.urgency !== 'Routine' ? 700 : 400 }}>{saved.urgency}</span></div>
                    </div>
                    {saved.clinicalInfo && <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.85rem' }}><strong>Clinical Info:</strong> {saved.clinicalInfo}</div>}
                    <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                        <thead><tr style={{ background: 'var(--bg-secondary)' }}><th style={{ padding: '8px 12px', textAlign: 'left' }}>Test</th><th style={{ padding: '8px 12px', textAlign: 'left' }}>Code</th><th style={{ padding: '8px 12px' }}>TAT</th><th style={{ padding: '8px 12px', textAlign: 'right' }}>Price</th></tr></thead>
                        <tbody>
                            {saved.tests.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '8px 12px' }}>{t.name}</td>
                                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '0.78rem' }}>{t.code}</td>
                                    <td style={{ padding: '8px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>{t.turnaround}</td>
                                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{t.price}</td>
                                </tr>
                            ))}
                            <tr style={{ borderTop: '2px solid var(--border)' }}><td colSpan={3} style={{ padding: '10px 12px', fontWeight: 700 }}>Total</td><td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>₹{saved.tests.reduce((s, t) => s + t.price, 0).toLocaleString()}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left"><h2>Lab Orders</h2><p>Order diagnostic investigations</p></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24 }}>
                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="card">
                        <div className="card-title">Patient</div>
                        <div className="search-box" style={{ marginBottom: 8 }}>
                            <Search size={15} className="search-icon" />
                            <input placeholder="Search patient..." value={patientSearch} onChange={e => { setPatientSearch(e.target.value); setSelectedPatient(null); }} />
                        </div>
                        {filteredPatients.length > 0 && !selectedPatient && (
                            <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                                {filteredPatients.map(p => (
                                    <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(p.name); }} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.patientId} · {p.age}y</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedPatient && (
                            <div style={{ padding: 12, background: 'var(--primary-light)', borderRadius: 8 }}>
                                <div style={{ fontWeight: 700 }}>{selectedPatient.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{selectedPatient.patientId} · {selectedPatient.age}y</div>
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="card-title">Order Details</div>
                        <div className="form-group">
                            <label className="form-label">Urgency</label>
                            {URGENCY_OPTS.map(u => (
                                <label key={u} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                                    <input type="radio" checked={urgency === u} onChange={() => setUrgency(u)} />
                                    <span style={{ fontSize: '0.88rem', fontWeight: u !== 'Routine' && urgency === u ? 700 : 400, color: u !== 'Routine' ? 'var(--danger)' : undefined }}>{u}</span>
                                </label>
                            ))}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Clinical Information</label>
                            <textarea className="form-input" rows={3} placeholder="Relevant history, reason for test..." value={clinicalInfo} onChange={e => setClinicalInfo(e.target.value)} />
                        </div>
                    </div>

                    {/* Selected tests summary */}
                    {selected.length > 0 && (
                        <div className="card">
                            <div className="card-title">Selected Tests ({selected.length})</div>
                            {selected.map(t => (
                                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                                    <span>{t.name}</span>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>₹{t.price}</span>
                                        <button onClick={() => toggleTest(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1rem' }}>×</button>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 700 }}>
                                <span>Total:</span><span style={{ color: 'var(--primary)' }}>₹{totalCost.toLocaleString()}</span>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={handleSubmit}>
                                <FlaskConical size={15} /> Place Lab Order
                            </button>
                        </div>
                    )}
                </div>

                {/* Right - Test catalog */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div className="card-title" style={{ marginBottom: 12 }}>Test Catalog</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                        <button className={`btn ${categoryFilter === 'all' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.78rem', padding: '4px 12px' }} onClick={() => setCategoryFilter('all')}>All</button>
                        {CATEGORIES.map(c => (
                            <button key={c} className={`btn ${categoryFilter === c ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.78rem', padding: '4px 12px' }} onClick={() => setCategoryFilter(c)}>{c}</button>
                        ))}
                    </div>
                    <div className="search-box" style={{ marginBottom: 12 }}>
                        <Search size={15} className="search-icon" />
                        <input placeholder="Search tests..." value={testSearch} onChange={e => setTestSearch(e.target.value)} />
                    </div>
                    <div style={{ maxHeight: 480, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {filteredTests.map(t => {
                            const isSelected = selected.find(s => s.id === t.id);
                            return (
                                <div key={t.id} onClick={() => toggleTest(t)} style={{ padding: '10px 14px', border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', background: isSelected ? 'var(--primary-light)' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                                    <div>
                                        <div style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.88rem' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{t.category} · {t.code} · Specimen: {t.specimen} · TAT: {t.turnaround}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0, marginLeft: 12 }}>
                                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{t.price}</span>
                                        {isSelected ? <Check size={18} color="var(--primary)" /> : <Plus size={18} color="var(--text-muted)" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

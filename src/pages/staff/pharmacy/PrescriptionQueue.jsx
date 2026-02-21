import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, Clock, AlertTriangle, Eye, Pill } from 'lucide-react';
import { dispensePrescription } from '../../../slices/pharmacySlice';


const STATUS = {
    pending: { label: '⏳ Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    partial: { label: '⚠️ Partial', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    completed: { label: '✅ Completed', color: 'var(--success)', bg: 'rgba(34,197,94,0.1)' },
};

export default function PrescriptionQueue() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const prescriptions = useSelector(s => s.pharmacy.prescriptions);
    const medicines = useSelector(s => s.pharmacy.medicines);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRx, setSelectedRx] = useState(null);
    const [confirmDispense, setConfirmDispense] = useState(null);

    const filtered = prescriptions.filter(rx => {
        const q = search.toLowerCase();
        const matchSearch = !q || rx.patientName.toLowerCase().includes(q) || rx.rxNumber.toLowerCase().includes(q) || rx.doctorName.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || rx.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const getMedStock = (medicineId) => {
        const med = medicines.find(m => m.id === medicineId);
        return med ? med.currentStock : 0;
    };

    const getMedAvailability = (item) => {
        const stock = getMedStock(item.medicineId);
        if (stock === 0) return { status: 'out', label: '❌ Out of Stock', color: 'var(--danger)' };
        if (stock < item.qty) return { status: 'low', label: `⚠️ Only ${stock} available (need ${item.qty})`, color: 'var(--warning)' };
        return { status: 'ok', label: `✅ Available (${stock} in stock)`, color: 'var(--success)' };
    };

    const canDispense = (rx) => rx.medicines.some(item => getMedStock(item.medicineId) >= item.qty);

    const handleDispense = (rxId) => {
        dispatch(dispensePrescription(rxId));
        setConfirmDispense(null);
        setSelectedRx(null);
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>📋 Prescription Queue</h2>
                    <p>Digital prescription management and dispensing</p>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {[
                    { label: 'Pending', count: prescriptions.filter(r => r.status === 'pending').length, color: '#f59e0b', icon: '⏳' },
                    { label: 'Partial', count: prescriptions.filter(r => r.status === 'partial').length, color: '#f97316', icon: '⚠️' },
                    { label: 'Completed', count: prescriptions.filter(r => r.status === 'completed').length, color: 'var(--success)', icon: '✅' },
                    { label: 'Total', count: prescriptions.length, color: 'var(--primary)', icon: '📋' },
                ].map(s => (
                    <div key={s.label} onClick={() => setStatusFilter(s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase())}
                        style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                        <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: s.color }}>{s.count}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filter Row ────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search by patient, Rx number, doctor..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="form-input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="partial">⚠️ Partial</option>
                    <option value="completed">✅ Completed</option>
                </select>
            </div>

            {/* ── Prescriptions Table ───────────────────────── */}
            <div className="table-container">
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Rx Number</th>
                                <th>Patient</th>
                                <th>Doctor / Dept</th>
                                <th>Date</th>
                                <th>Medicines</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No prescriptions found</td></tr>
                            ) : filtered.map(rx => {
                                const sc = STATUS[rx.status];
                                const isPending = rx.status === 'pending' || rx.status === 'partial';
                                return (
                                    <tr key={rx.id}>
                                        <td>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.83rem' }}>{rx.rxNumber}</span>
                                            {rx.status === 'pending' && <div style={{ fontSize: '0.68rem', color: 'var(--danger)', fontWeight: 600 }}>⚡ URGENT</div>}
                                        </td>
                                        <td>
                                            <strong style={{ fontSize: '0.87rem' }}>{rx.patientName}</strong>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Valid until: {rx.validUntil}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.83rem' }}>{rx.doctorName}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rx.department}</div>
                                        </td>
                                        <td style={{ fontSize: '0.83rem' }}>{rx.date}</td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{rx.medicines.length}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> item{rx.medicines.length > 1 ? 's' : ''}</span>
                                        </td>
                                        <td>
                                            <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, color: sc.color, background: sc.bg }}>{sc.label}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-sm btn-outline" style={{ fontSize: '0.72rem' }} onClick={() => setSelectedRx(rx)}>
                                                    <Eye size={12} /> View
                                                </button>
                                                {isPending && canDispense(rx) && (
                                                    <button className="btn btn-sm btn-primary" style={{ fontSize: '0.72rem' }} onClick={() => setConfirmDispense(rx)}>
                                                        Dispense
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── View Prescription Modal ───────────────────── */}
            {selectedRx && (
                <div className="modal-overlay" onClick={() => setSelectedRx(null)}>
                    <div className="modal-content" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📋 {selectedRx.rxNumber}</h3>
                            <button className="modal-close" onClick={() => setSelectedRx(null)}>×</button>
                        </div>
                        <div style={{ padding: '16px 24px' }}>
                            {/* Header info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, padding: 14, background: 'var(--sidebar-bg)', borderRadius: 10 }}>
                                {[['Patient', selectedRx.patientName], ['Rx Number', selectedRx.rxNumber], ['Doctor', selectedRx.doctorName], ['Department', selectedRx.department], ['Date', selectedRx.date], ['Valid Until', selectedRx.validUntil]].map(([k, v]) => (
                                    <div key={k}><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{k}</span><div style={{ fontWeight: 600, fontSize: '0.87rem' }}>{v}</div></div>
                                ))}
                            </div>
                            {/* Medicine list */}
                            <h4 style={{ marginBottom: 10, fontSize: '0.9rem' }}>💊 Prescribed Medicines</h4>
                            {selectedRx.medicines.map((item, i) => {
                                const avail = getMedAvailability(item);
                                return (
                                    <div key={i} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.87rem', marginBottom: 2 }}>{item.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📋 {item.dosage} &nbsp;·&nbsp; ⏱ {item.duration} &nbsp;·&nbsp; Qty: <strong>{item.qty}</strong></div>
                                        </div>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: avail.color, flexShrink: 0, marginTop: 2 }}>{avail.label}</span>
                                    </div>
                                );
                            })}
                            {selectedRx.notes && (
                                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', marginTop: 10 }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📝 Doctor Notes: </span>
                                    <span style={{ fontSize: '0.83rem' }}>{selectedRx.notes}</span>
                                </div>
                            )}
                            {selectedRx.dispensedOn && (
                                <div style={{ padding: '8px 14px', marginTop: 10, borderRadius: 8, background: 'rgba(34,197,94,0.08)', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                                    ✅ Dispensed on: {selectedRx.dispensedOn}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer" style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" onClick={() => setSelectedRx(null)}>Close</button>
                            {(selectedRx.status === 'pending' || selectedRx.status === 'partial') && canDispense(selectedRx) && (
                                <button className="btn btn-primary" onClick={() => { setConfirmDispense(selectedRx); setSelectedRx(null); }}>
                                    💊 Dispense All Available
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirm Dispense Modal ────────────────────── */}
            {confirmDispense && (
                <div className="modal-overlay" onClick={() => setConfirmDispense(null)}>
                    <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>⚠️ Confirm Dispensing</h3>
                            <button className="modal-close" onClick={() => setConfirmDispense(null)}>×</button>
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            <p style={{ marginBottom: 8 }}>Dispense prescription <strong>{confirmDispense.rxNumber}</strong> for <strong>{confirmDispense.patientName}</strong>?</p>
                            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>This will reduce stock for all available medicines and mark the prescription as Completed.</p>
                            <div style={{ marginTop: 16 }}>
                                {confirmDispense.medicines.map((item, i) => {
                                    const avail = getMedAvailability(item);
                                    return (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.82rem', borderBottom: '1px solid var(--border)' }}>
                                            <span>{item.name} × {item.qty}</span>
                                            <span style={{ color: avail.color, fontWeight: 600, fontSize: '0.75rem' }}>{avail.status === 'ok' ? '✅ Will dispense' : avail.status === 'low' ? '⚠️ Partial' : '❌ Skip'}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="modal-footer" style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" onClick={() => setConfirmDispense(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={() => handleDispense(confirmDispense.id)}>✅ Confirm & Dispense</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

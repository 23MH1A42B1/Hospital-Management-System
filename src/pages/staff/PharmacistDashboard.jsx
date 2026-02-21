import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Package, AlertTriangle, Clock, ShoppingCart, DollarSign,
    AlertCircle, Search, TrendingUp, Bell, ArrowRight, RefreshCw
} from 'lucide-react';
import { restockMedicine } from '../../slices/pharmacySlice';

export default function PharmacistDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const medicines = useSelector(s => s.pharmacy.medicines);
    const prescriptions = useSelector(s => s.pharmacy.prescriptions);
    const sales = useSelector(s => s.pharmacy.sales);
    const [restockModal, setRestockModal] = useState(null);
    const [restockForm, setRestockForm] = useState({ qty: '', batchNumber: '', expiryDate: '' });

    // ── Computed stats ───────────────────────────────────────
    const lowStock = medicines.filter(m => m.status === 'low-stock');
    const outOfStock = medicines.filter(m => m.status === 'out-of-stock');
    const expiringSoon = medicines.filter(m => m.status === 'expiring-soon');
    const expired = medicines.filter(m => m.status === 'expired');
    const pendingRx = prescriptions.filter(p => p.status === 'pending').length;
    const todaySales = sales.reduce((sum, s) => sum + s.total, 0);

    const allAlerts = [
        ...outOfStock.map(m => ({ type: 'danger', icon: '❌', text: `OUT OF STOCK: ${m.brandName} (${m.genericName} ${m.strength}) — Order immediately` })),
        ...lowStock.map(m => ({ type: 'warning', icon: '⚠️', text: `LOW STOCK: ${m.brandName} (${m.genericName} ${m.strength}) — Only ${m.currentStock} ${m.unit} left` })),
        ...expiringSoon.map(m => ({ type: 'orange', icon: '⏰', text: `EXPIRING SOON: ${m.brandName} — ${m.daysToExpiry} days remaining (${m.expiryDate})` })),
        ...expired.map(m => ({ type: 'danger', icon: '🚫', text: `EXPIRED: ${m.brandName} — Quarantine immediately!` })),
    ];

    const topLowStock = [...medicines].filter(m => m.currentStock <= m.reorderLevel).sort((a, b) => a.currentStock - b.currentStock).slice(0, 5);
    const recentSales = sales.slice(0, 5);

    const handleRestock = () => {
        if (!restockForm.qty || !restockModal) return;
        dispatch(restockMedicine({ id: restockModal.id, qty: parseInt(restockForm.qty), batchNumber: restockForm.batchNumber, expiryDate: restockForm.expiryDate }));
        setRestockModal(null);
        setRestockForm({ qty: '', batchNumber: '', expiryDate: '' });
    };

    return (
        <div>
            {/* ── Header ─────────────────────────────────────── */}
            <div className="page-header">
                <div className="page-header-left">
                    <h2>💊 Pharmacy Dashboard</h2>
                    <p>Medicine inventory, prescriptions & sales management</p>
                </div>
                <div className="page-header-right">
                    <button className="btn btn-primary" onClick={() => navigate('/pharmacist/sale')}>
                        <ShoppingCart size={16} /> New Sale
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ───────────────────────────────────── */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card blue" style={{ cursor: 'pointer' }} onClick={() => navigate('/pharmacist/inventory')}>
                    <div className="kpi-icon blue"><Package size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{medicines.length}</div>
                        <div className="kpi-label">Total Medicines</div>
                    </div>
                </div>
                <div className="kpi-card red" style={{ cursor: 'pointer' }} onClick={() => navigate('/pharmacist/inventory?filter=low-stock')}>
                    <div className="kpi-icon red"><AlertCircle size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{lowStock.length}</div>
                        <div className="kpi-label">Low Stock Alerts</div>
                    </div>
                    {lowStock.length > 0 && <div style={{ position: 'absolute', top: 8, right: 12, background: 'var(--danger)', color: '#fff', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px' }}>URGENT</div>}
                </div>
                <div className="kpi-card orange" style={{ cursor: 'pointer' }} onClick={() => navigate('/pharmacist/inventory?filter=expiring-soon')}>
                    <div className="kpi-icon orange"><Clock size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{expiringSoon.length}</div>
                        <div className="kpi-label">Expiring Soon (&lt;30d)</div>
                    </div>
                </div>
                <div className="kpi-card purple" style={{ cursor: 'pointer' }} onClick={() => navigate('/pharmacist/prescriptions')}>
                    <div className="kpi-icon purple"><Bell size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{pendingRx}</div>
                        <div className="kpi-label">Pending Prescriptions</div>
                    </div>
                    {pendingRx > 0 && <div style={{ position: 'absolute', top: 8, right: 12, background: 'var(--primary)', color: '#fff', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px' }}>NEW</div>}
                </div>
                <div className="kpi-card green">
                    <div className="kpi-icon green"><DollarSign size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">${todaySales.toFixed(2)}</div>
                        <div className="kpi-label">Today's Sales</div>
                    </div>
                </div>
                <div className="kpi-card red" style={{ cursor: 'pointer' }} onClick={() => navigate('/pharmacist/inventory?filter=out-of-stock')}>
                    <div className="kpi-icon red"><AlertTriangle size={22} /></div>
                    <div className="kpi-info">
                        <div className="kpi-value">{outOfStock.length}</div>
                        <div className="kpi-label">Out of Stock</div>
                    </div>
                    {outOfStock.length > 0 && <div style={{ position: 'absolute', top: 8, right: 12, background: '#7f1d1d', color: '#fca5a5', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px' }}>CRITICAL</div>}
                </div>
            </div>

            {/* ── Quick Actions ───────────────────────────────── */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
                {[
                    { icon: '🔍', label: 'Search Medicines', path: '/pharmacist/inventory' },
                    { icon: '💊', label: 'New Sale (OTC)', path: '/pharmacist/sale' },
                    { icon: '📋', label: 'View Prescriptions', path: '/pharmacist/prescriptions' },
                    { icon: '⚠️', label: 'Low Stock Items', path: '/pharmacist/inventory?filter=low-stock' },
                    { icon: '⏰', label: 'Expiring Soon', path: '/pharmacist/inventory?filter=expiring-soon' },
                    { icon: '📊', label: 'Sales Reports', path: '/pharmacist/reports' },
                ].map(qa => (
                    <button key={qa.label} onClick={() => navigate(qa.path)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--card-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                        <span>{qa.icon}</span><span>{qa.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Alerts Strip ────────────────────────────────── */}
            {allAlerts.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Bell size={16} style={{ color: 'var(--warning)' }} /> Active Pharmacy Alerts ({allAlerts.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
                        {allAlerts.map((a, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 8, background: a.type === 'danger' ? 'rgba(239,68,68,0.08)' : a.type === 'warning' ? 'rgba(234,179,8,0.08)' : 'rgba(249,115,22,0.08)', border: `1px solid ${a.type === 'danger' ? 'rgba(239,68,68,0.2)' : a.type === 'warning' ? 'rgba(234,179,8,0.2)' : 'rgba(249,115,22,0.2)'}`, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                                <span style={{ fontSize: '1rem' }}>{a.icon}</span>
                                <span>{a.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* ── Low Stock Medicines ─────────────────────── */}
                <div className="table-container">
                    <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>⚠️ Critical Low Stock</h3>
                        <button className="btn btn-sm btn-outline" onClick={() => navigate('/pharmacist/inventory?filter=low-stock')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead><tr><th>Medicine</th><th>Stock</th><th>Reorder At</th><th>Action</th></tr></thead>
                            <tbody>
                                {topLowStock.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>✅ All stocks adequate</td></tr>
                                ) : topLowStock.map(m => (
                                    <tr key={m.id}>
                                        <td>
                                            <strong style={{ fontSize: '0.85rem' }}>{m.brandName}</strong>
                                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{m.genericName} {m.strength}</div>
                                        </td>
                                        <td>
                                            <span style={{ color: m.currentStock === 0 ? 'var(--danger)' : 'var(--warning)', fontWeight: 700 }}>
                                                {m.currentStock === 0 ? '❌ 0' : `⚠️ ${m.currentStock}`}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> {m.unit}</span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem' }}>{m.reorderLevel} {m.unit}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline" style={{ fontSize: '0.72rem' }} onClick={() => setRestockModal(m)}>
                                                <RefreshCw size={12} /> Restock
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Recent Sales ────────────────────────────── */}
                <div className="table-container">
                    <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>🧾 Today's Recent Sales</h3>
                        <button className="btn btn-sm btn-outline" onClick={() => navigate('/pharmacist/reports')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            Reports <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead><tr><th>Bill #</th><th>Time</th><th>Patient</th><th>Total</th><th>Payment</th></tr></thead>
                            <tbody>
                                {recentSales.map(s => (
                                    <tr key={s.id}>
                                        <td style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)' }}>{s.billNumber}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{s.time}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{s.patient}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--success)' }}>${s.total.toFixed(2)}</td>
                                        <td><span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, background: 'var(--primary-light)', color: 'var(--primary)' }}>{s.payment}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{sales.length} sales today</span>
                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>Total: ${todaySales.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* ── Restock Modal ───────────────────────────────── */}
            {restockModal && (
                <div className="modal-overlay" onClick={() => setRestockModal(null)}>
                    <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📦 Restock Medicine</h3>
                            <button className="modal-close" onClick={() => setRestockModal(null)}>×</button>
                        </div>
                        <div className="modal-body" style={{ padding: '20px 24px' }}>
                            <p style={{ marginBottom: 16 }}><strong>{restockModal.brandName}</strong> — {restockModal.genericName} {restockModal.strength}</p>
                            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 16 }}>Current Stock: <strong style={{ color: 'var(--warning)' }}>{restockModal.currentStock} {restockModal.unit}</strong></p>
                            <div className="form-group">
                                <label className="form-label">Quantity to Add *</label>
                                <input className="form-input" type="number" min="1" placeholder="Enter quantity" value={restockForm.qty} onChange={e => setRestockForm(f => ({ ...f, qty: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Batch Number</label>
                                <input className="form-input" type="text" placeholder="e.g. BT2026001" value={restockForm.batchNumber} onChange={e => setRestockForm(f => ({ ...f, batchNumber: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Expiry Date</label>
                                <input className="form-input" type="date" value={restockForm.expiryDate} onChange={e => setRestockForm(f => ({ ...f, expiryDate: e.target.value }))} />
                            </div>
                        </div>
                        <div className="modal-footer" style={{ padding: '12px 24px', display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--border)' }}>
                            <button className="btn btn-outline" onClick={() => setRestockModal(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleRestock} disabled={!restockForm.qty}>✅ Confirm Restock</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

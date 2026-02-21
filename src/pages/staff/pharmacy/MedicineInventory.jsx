import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ShoppingCart, RefreshCw, Info, ChevronDown } from 'lucide-react';
import { addToCart, restockMedicine } from '../../../slices/pharmacySlice';


const FORM_ICONS = { Tablet: '💊', Capsule: '💊', Syrup: '🍶', Injection: '💉', Ointment: '🧴', Drops: '💧', Inhaler: '🫁' };
const STATUS_CONFIG = {
    'in-stock': { label: '✅ In Stock', color: 'var(--success)', bg: 'rgba(34,197,94,0.1)' },
    'low-stock': { label: '⚠️ Low Stock', color: 'var(--warning)', bg: 'rgba(234,179,8,0.1)' },
    'out-of-stock': { label: '❌ Out of Stock', color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)' },
    'expiring-soon': { label: '⏰ Expiring Soon', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    'expired': { label: '🚫 Expired', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};
const CATEGORIES = ['All', 'Fever & Pain Relief', 'Cold & Allergy', 'Antibiotics', 'Antacids & Digestive', 'Vitamins & Supplements', 'Diabetes Care', 'Blood Pressure', 'Cardiac'];
const QUICK_SEARCHES = ['Paracetamol', 'Cetirizine', 'Omeprazole', 'Amoxicillin', 'Metformin', 'Amlodipine', 'Vitamin D3', 'Aspirin'];

export default function MedicineInventory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const medicines = useSelector(s => s.pharmacy.medicines);

    const initialFilter = searchParams.get('filter') || 'all';
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(initialFilter);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [detailMed, setDetailMed] = useState(null);
    const [restockModal, setRestockModal] = useState(null);
    const [restockForm, setRestockForm] = useState({ qty: '', batchNumber: '', expiryDate: '' });

    const filtered = useMemo(() => {
        let list = [...medicines];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(m =>
                m.brandName.toLowerCase().includes(q) ||
                m.genericName.toLowerCase().includes(q) ||
                m.composition?.toLowerCase().includes(q) ||
                m.sku?.toLowerCase().includes(q) ||
                m.manufacturer?.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== 'all') list = list.filter(m => m.status === statusFilter);
        if (categoryFilter !== 'All') list = list.filter(m => m.category === categoryFilter);
        list.sort((a, b) => {
            if (sortBy === 'name') return a.brandName.localeCompare(b.brandName);
            if (sortBy === 'stock-low') return a.currentStock - b.currentStock;
            if (sortBy === 'expiry') return (a.expiryDate || '9999').localeCompare(b.expiryDate || '9999');
            if (sortBy === 'price') return a.sellingPrice - b.sellingPrice;
            return 0;
        });
        return list;
    }, [medicines, search, statusFilter, categoryFilter, sortBy]);

    const handleAddToCart = (m) => {
        if (m.currentStock === 0 || m.status === 'expired') return;
        dispatch(addToCart({ medicine: m, qty: 1 }));
        navigate('/pharmacist/sale');
    };

    const handleRestock = () => {
        if (!restockForm.qty) return;
        dispatch(restockMedicine({ id: restockModal.id, qty: parseInt(restockForm.qty), batchNumber: restockForm.batchNumber, expiryDate: restockForm.expiryDate }));
        setRestockModal(null);
        setRestockForm({ qty: '', batchNumber: '', expiryDate: '' });
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>💊 Medicine Inventory</h2>
                    <p>{medicines.length} medicines · {filtered.length} shown</p>
                </div>
                <div className="page-header-right">
                    <button className="btn btn-primary" onClick={() => navigate('/pharmacist/sale')}>
                        <ShoppingCart size={16} /> New Sale
                    </button>
                </div>
            </div>

            {/* ── Search + Sort ─────────────────────────────── */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search by name, brand, composition, SKU..." value={search} onChange={e => setSearch(e.target.value)} />
                    {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>}
                </div>
                <select className="form-input" style={{ width: 180 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="name">Sort: Name (A-Z)</option>
                    <option value="stock-low">Sort: Stock (Low→High)</option>
                    <option value="expiry">Sort: Expiry Date</option>
                    <option value="price">Sort: Price</option>
                </select>
            </div>

            {/* ── Quick Search Buttons ──────────────────────── */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {QUICK_SEARCHES.map(q => (
                    <button key={q} onClick={() => setSearch(q)} style={{ padding: '5px 14px', borderRadius: 999, border: '1px solid var(--border)', background: search === q ? 'var(--primary)' : 'var(--card-bg)', color: search === q ? '#fff' : 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
                        {q}
                    </button>
                ))}
                {search && <button onClick={() => setSearch('')} style={{ padding: '5px 14px', borderRadius: 999, border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
                    ✕ Clear
                </button>}
            </div>

            {/* ── Category Tabs ─────────────────────────────── */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategoryFilter(cat)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: categoryFilter === cat ? 'var(--primary)' : 'var(--sidebar-bg)', color: categoryFilter === cat ? '#fff' : 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: categoryFilter === cat ? 700 : 500 }}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── Status Filter Pills ────────────────────────── */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {[
                    { key: 'all', label: `All (${medicines.length})` },
                    { key: 'in-stock', label: `✅ In Stock (${medicines.filter(m => m.status === 'in-stock').length})` },
                    { key: 'low-stock', label: `⚠️ Low Stock (${medicines.filter(m => m.status === 'low-stock').length})` },
                    { key: 'out-of-stock', label: `❌ Out of Stock (${medicines.filter(m => m.status === 'out-of-stock').length})` },
                    { key: 'expiring-soon', label: `⏰ Expiring (${medicines.filter(m => m.status === 'expiring-soon').length})` },
                    { key: 'expired', label: `🚫 Expired (${medicines.filter(m => m.status === 'expired').length})` },
                ].map(f => (
                    <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${statusFilter === f.key ? 'var(--primary)' : 'var(--border)'}`, background: statusFilter === f.key ? 'var(--primary-light)' : 'transparent', color: statusFilter === f.key ? 'var(--primary)' : 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: statusFilter === f.key ? 700 : 400 }}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* ── Medicine Cards ────────────────────────────── */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    <Search size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <p>No medicines found matching your search.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                    {filtered.map(m => {
                        const sc = STATUS_CONFIG[m.status] || STATUS_CONFIG['in-stock'];
                        const canAdd = m.currentStock > 0 && m.status !== 'expired';
                        return (
                            <div key={m.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, transition: 'box-shadow 0.2s', position: 'relative' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                {/* ── Header ── */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                            <span>{FORM_ICONS[m.form] || '💊'}</span>
                                            <strong style={{ fontSize: '0.95rem' }}>{m.brandName}</strong>
                                            {m.prescriptionRequired && <span style={{ fontSize: '0.62rem', background: '#1d4ed8', color: '#bfdbfe', padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>Rx</span>}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.genericName} {m.strength} · {m.form}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.sku}</div>
                                    </div>
                                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: sc.color, background: sc.bg, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                        {sc.label}
                                    </span>
                                </div>

                                {/* ── Details ── */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                                    <div style={{ textAlign: 'center', background: 'var(--sidebar-bg)', borderRadius: 8, padding: '8px 4px' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: m.currentStock === 0 ? 'var(--danger)' : m.currentStock <= m.reorderLevel ? 'var(--warning)' : 'var(--success)' }}>{m.currentStock}</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.unit}</div>
                                    </div>
                                    <div style={{ textAlign: 'center', background: 'var(--sidebar-bg)', borderRadius: 8, padding: '8px 4px' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>${m.sellingPrice.toFixed(2)}</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>per {m.unit.replace(/s$/, '').toLowerCase()}</div>
                                    </div>
                                    <div style={{ textAlign: 'center', background: 'var(--sidebar-bg)', borderRadius: 8, padding: '8px 4px' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: m.daysToExpiry !== null && m.daysToExpiry <= 30 ? 'var(--danger)' : 'var(--text-primary)' }}>
                                            {m.expiryDate ? m.daysToExpiry + 'd' : '—'}
                                        </div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>to expiry</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                                    📍 {m.storageLocation} &nbsp;·&nbsp; 🏭 {m.manufacturer}
                                    {m.expiryDate && <>&nbsp;·&nbsp; Exp: {m.expiryDate}</>}
                                </div>

                                {/* ── Alternatives notice ── */}
                                {m.status === 'out-of-stock' && m.alternatives?.length > 0 && (
                                    <div style={{ fontSize: '0.74rem', padding: '6px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, marginBottom: 10, color: 'var(--success)' }}>
                                        💡 {m.alternatives.length} alternative(s) available
                                    </div>
                                )}

                                {/* ── Actions ── */}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-sm btn-outline" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => setDetailMed(m)}>
                                        <Info size={12} /> Details
                                    </button>
                                    {canAdd ? (
                                        <button className="btn btn-sm btn-primary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => handleAddToCart(m)}>
                                            <ShoppingCart size={12} /> Add to Cart
                                        </button>
                                    ) : (
                                        <button className="btn btn-sm" style={{ flex: 1, fontSize: '0.75rem', background: 'var(--sidebar-bg)', color: 'var(--text-muted)' }} onClick={() => setRestockModal(m)}>
                                            <RefreshCw size={12} /> Reorder
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Medicine Detail Modal ─────────────────────── */}
            {detailMed && (
                <div className="modal-overlay" onClick={() => setDetailMed(null)}>
                    <div className="modal-content" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>💊 {detailMed.brandName} — Medicine Details</h3>
                            <button className="modal-close" onClick={() => setDetailMed(null)}>×</button>
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            {/* Status Badge */}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                                <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, color: STATUS_CONFIG[detailMed.status].color, background: STATUS_CONFIG[detailMed.status].bg }}>{STATUS_CONFIG[detailMed.status].label}</span>
                                {detailMed.prescriptionRequired && <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, background: '#1d4ed8', color: '#bfdbfe' }}>🔵 Prescription Required</span>}
                                {!detailMed.prescriptionRequired && <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, background: 'rgba(34,197,94,0.12)', color: 'var(--success)' }}>💚 OTC — No Prescription Needed</span>}
                            </div>
                            {/* Info Sections */}
                            {[
                                { title: '📋 Basic Information', rows: [['Generic Name', detailMed.genericName], ['Brand Name', detailMed.brandName], ['Medicine Code', detailMed.sku], ['Manufacturer', detailMed.manufacturer], ['Form', detailMed.form], ['Strength', detailMed.strength]] },
                                { title: '🏷️ Classification', rows: [['Category', detailMed.category], ['Drug Class', detailMed.drugClass], ['Composition', detailMed.composition]] },
                                { title: '📦 Stock Information', rows: [['Current Stock', `${detailMed.currentStock} ${detailMed.unit}`], ['Pieces per Unit', detailMed.piecesPerUnit], ['Reorder Level', `${detailMed.reorderLevel} ${detailMed.unit}`], ['Max Stock', `${detailMed.maxStock} ${detailMed.unit}`], ['Storage Location', detailMed.storageLocation], ['Storage Temp', detailMed.storageTemp]] },
                                { title: '💰 Pricing', rows: [['Cost Price', `$${detailMed.costPrice.toFixed(2)}`], ['MRP', `$${detailMed.mrp.toFixed(2)}`], ['Selling Price', `$${detailMed.sellingPrice.toFixed(2)}`], ['GST', `${detailMed.gst}%`]] },
                                { title: '🗓️ Batch & Expiry', rows: [['Batch Number', detailMed.batchNumber], ['Mfg Date', detailMed.mfgDate || '—'], ['Expiry Date', detailMed.expiryDate || '—'], ['Days to Expiry', detailMed.daysToExpiry !== null ? `${detailMed.daysToExpiry} days` : '—']] },
                                { title: '💊 Usage Information', rows: [['Indication', detailMed.indication], ['Dosage', detailMed.dosage], ['Max Daily Dose', detailMed.maxDailyDose], ['Side Effects', detailMed.sideEffects], ['Contraindications', detailMed.contraindications]] },
                                { title: '🚚 Supplier', rows: [['Supplier Name', detailMed.supplier], ['Contact', detailMed.supplierContact], ['Last Purchase', detailMed.lastPurchaseDate], ['Lead Time', `${detailMed.leadTime} days`]] },
                                { title: '📈 Sales Analytics', rows: [['Total Sold', `${detailMed.totalSold} ${detailMed.unit}`], ['Avg Monthly Sales', `${detailMed.avgMonthlySales} ${detailMed.unit}`], ['Last Sold', detailMed.lastSoldDate], ['Movement', detailMed.avgMonthlySales >= 60 ? '🔥 Fast-moving' : detailMed.avgMonthlySales >= 30 ? '📦 Moderate' : '🐌 Slow-moving']] },
                            ].map(section => (
                                <div key={section.title} style={{ marginBottom: 16 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid var(--border)' }}>{section.title}</div>
                                    {section.rows.map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: '0.83rem' }}>
                                            <span style={{ color: 'var(--text-muted)', minWidth: 150, flexShrink: 0 }}>{k}</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {/* ── Alternatives ── */}
                            {detailMed.status === 'out-of-stock' && detailMed.alternatives?.length > 0 && (
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--success)', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid var(--border)' }}>💡 Available Alternatives</div>
                                    {detailMed.alternatives.map(altId => {
                                        const alt = medicines.find(m => m.id === altId);
                                        if (!alt) return null;
                                        return (
                                            <div key={altId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(34,197,94,0.08)', borderRadius: 8, marginBottom: 6 }}>
                                                <div>
                                                    <strong style={{ fontSize: '0.85rem' }}>{alt.brandName}</strong>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> — {alt.genericName} {alt.strength}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alt.currentStock} {alt.unit}</span>
                                                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.85rem' }}>✅ ${alt.sellingPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer" style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" onClick={() => { setRestockModal(detailMed); setDetailMed(null); }}>
                                <RefreshCw size={14} /> Restock
                            </button>
                            {detailMed.currentStock > 0 && detailMed.status !== 'expired' && (
                                <button className="btn btn-primary" onClick={() => { handleAddToCart(detailMed); setDetailMed(null); }}>
                                    <ShoppingCart size={14} /> Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Restock Modal ─────────────────────────────── */}
            {restockModal && (
                <div className="modal-overlay" onClick={() => setRestockModal(null)}>
                    <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📦 Restock — {restockModal.brandName}</h3>
                            <button className="modal-close" onClick={() => setRestockModal(null)}>×</button>
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 16 }}>Current Stock: <strong>{restockModal.currentStock} {restockModal.unit}</strong> &nbsp;·&nbsp; Reorder Qty: <strong>{restockModal.reorderQty} {restockModal.unit}</strong></p>
                            <div className="form-group"><label className="form-label">Quantity to Add *</label><input className="form-input" type="number" min="1" placeholder="Enter quantity" value={restockForm.qty} onChange={e => setRestockForm(f => ({ ...f, qty: e.target.value }))} /></div>
                            <div className="form-group"><label className="form-label">New Batch Number</label><input className="form-input" type="text" placeholder="e.g. BT2026001" value={restockForm.batchNumber} onChange={e => setRestockForm(f => ({ ...f, batchNumber: e.target.value }))} /></div>
                            <div className="form-group"><label className="form-label">New Expiry Date</label><input className="form-input" type="date" value={restockForm.expiryDate} onChange={e => setRestockForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
                        </div>
                        <div className="modal-footer" style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" onClick={() => setRestockModal(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleRestock} disabled={!restockForm.qty}>✅ Confirm Restock</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, X, Plus, Minus, Trash2, ShoppingCart, Check, Printer } from 'lucide-react';
import { addToCart, updateCartQty, removeFromCart, clearCart, completeSale } from '../../../slices/pharmacySlice';


const PAYMENT_METHODS = ['Cash', 'Card', 'UPI / Digital', 'Insurance', 'Credit'];

export default function QuickSale() {
    const dispatch = useDispatch();
    const medicines = useSelector(s => s.pharmacy.medicines);
    const cart = useSelector(s => s.pharmacy.cart);
    const sales = useSelector(s => s.pharmacy.sales);

    const [search, setSearch] = useState('');
    const [patientName, setPatientName] = useState('');
    const [discount, setDiscount] = useState('0');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [billModal, setBillModal] = useState(null);

    const results = useMemo(() => {
        if (!search.trim()) return [];
        const q = search.toLowerCase();
        return medicines.filter(m =>
            m.brandName.toLowerCase().includes(q) ||
            m.genericName.toLowerCase().includes(q) ||
            m.composition?.toLowerCase().includes(q)
        ).slice(0, 8);
    }, [medicines, search]);

    // ── Bill calculations ─────────────────────────────────
    const subtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.qty, 0);
    const avgGst = cart.length > 0 ? cart.reduce((sum, item) => sum + (item.gst || 0) * item.sellingPrice * item.qty, 0) / subtotal / 100 : 0;
    const gstAmount = subtotal * avgGst;
    const discountAmt = parseFloat(discount) || 0;
    const total = subtotal + gstAmount - discountAmt;

    const nextBillNum = `INV-2026-${String(570 + ((sales?.length || 0) + 1)).padStart(5, '0')}`;

    const handleAddToCart = (m, qty = 1) => {
        if (m.currentStock === 0) return;
        dispatch(addToCart({ medicine: m, qty }));
        setSearch('');
    };

    const handleCompleteSale = () => {
        if (cart.length === 0) return;
        const now = new Date();
        const sale = {
            // eslint-disable-next-line
            id: `sale_${Date.now()}`,
            billNumber: nextBillNum,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            patient: patientName.trim() || 'Walk-in Customer',
            items: cart.map(item => ({
                medicineId: item.id,
                name: `${item.brandName} (${item.genericName} ${item.strength})`,
                qty: item.qty,
                unit: item.unit,
                price: item.sellingPrice,
            })),
            subtotal, gst: gstAmount, discount: discountAmt, total,
            payment: paymentMethod,
        };
        dispatch(completeSale(sale));
        setBillModal(sale);
        setPatientName('');
        setDiscount('0');
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>🧾 Quick Sale — OTC Billing</h2>
                    <p>Search medicines, add to cart, and generate bills</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
                {/* ── LEFT: Search + Results ─────────────────── */}
                <div>
                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: 16 }}>
                        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="form-input"
                            style={{ paddingLeft: 44, fontSize: '1rem', height: 48 }}
                            placeholder="🔍 Search medicine by name, brand or ingredient..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                        />
                        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>}
                    </div>

                    {/* Quick suggestions */}
                    {!search && (
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10 }}>Common searches:</p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {['Paracetamol', 'Cetirizine', 'Omeprazole', 'Vitamin C', 'Aspirin', 'Metformin', 'Amoxicillin', 'Dolo'].map(q => (
                                    <button key={q} onClick={() => setSearch(q)} style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer' }}>{q}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    {results.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>{results.length} result(s) for "{search}"</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {results.map(m => {
                                    const canAdd = m.currentStock > 0 && m.status !== 'expired';
                                    return (
                                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, opacity: canAdd ? 1 : 0.6 }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <strong style={{ fontSize: '0.92rem' }}>{m.brandName}</strong>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.genericName} {m.strength} · {m.form}</span>
                                                    {m.prescriptionRequired && <span style={{ fontSize: '0.6rem', background: '#1d4ed8', color: '#bfdbfe', padding: '1px 5px', borderRadius: 999, fontWeight: 700 }}>Rx</span>}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                    Stock: <strong style={{ color: canAdd ? 'var(--success)' : 'var(--danger)' }}>{m.currentStock} {m.unit}</strong>
                                                    &nbsp;·&nbsp; <span style={{ color: 'var(--primary)', fontWeight: 700 }}>${m.sellingPrice.toFixed(2)}</span> / {m.unit.replace(/s$/, '').toLowerCase()}
                                                    {m.gst > 0 && <span style={{ color: 'var(--text-muted)' }}> + {m.gst}% GST</span>}
                                                </div>
                                            </div>
                                            {canAdd ? (
                                                <button className="btn btn-sm btn-primary" onClick={() => handleAddToCart(m)}>
                                                    <Plus size={14} /> Add
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)' }}>
                                                    {m.status === 'expired' ? '🚫 Expired' : '❌ Out of Stock'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {search && results.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'var(--card-bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <Search size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                            <p>No medicines found for "{search}"</p>
                        </div>
                    )}

                    {/* ── Today's Sales Summary ── */}
                    <div style={{ marginTop: 20 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>📋 Recent Transactions</h4>
                        <div className="table-container">
                            <div className="table-responsive">
                                <table>
                                    <thead><tr><th>Bill #</th><th>Time</th><th>Patient</th><th>Items</th><th>Total</th><th>Payment</th></tr></thead>
                                    <tbody>
                                        {sales.slice(0, 6).map(s => (
                                            <tr key={s.id}>
                                                <td style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)' }}>{s.billNumber}</td>
                                                <td style={{ fontSize: '0.78rem' }}>{s.time}</td>
                                                <td style={{ fontSize: '0.78rem' }}>{s.patient}</td>
                                                <td style={{ fontSize: '0.78rem' }}>{s.items.length}</td>
                                                <td style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.83rem' }}>${s.total.toFixed(2)}</td>
                                                <td><span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: 999, background: 'var(--primary-light)', color: 'var(--primary)' }}>{s.payment}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Cart / Bill ─────────────────────── */}
                <div style={{ position: 'sticky', top: 20 }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                        {/* Cart Header */}
                        <div style={{ padding: '14px 18px', background: 'var(--primary)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <ShoppingCart size={18} />
                                <strong>Billing Cart</strong>
                                {cart.length > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 999, padding: '1px 8px', fontSize: '0.78rem' }}>{cart.length} item{cart.length > 1 ? 's' : ''}</span>}
                            </div>
                            {cart.length > 0 && <button onClick={() => dispatch(clearCart())} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: '0.72rem' }}>Clear</button>}
                        </div>

                        {/* Bill Number + Patient */}
                        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'var(--sidebar-bg)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Bill: <strong style={{ color: 'var(--primary)' }}>{nextBillNum}</strong></div>
                            <input className="form-input" style={{ fontSize: '0.82rem', height: 34 }} placeholder="Patient name (optional)" value={patientName} onChange={e => setPatientName(e.target.value)} />
                        </div>

                        {/* Cart Items */}
                        <div style={{ minHeight: 120, maxHeight: 280, overflowY: 'auto', padding: '8px 0' }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                                    <ShoppingCart size={28} style={{ opacity: 0.3, marginBottom: 6 }} />
                                    <p style={{ fontSize: '0.82rem' }}>Cart is empty.<br />Search and add medicines.</p>
                                </div>
                            ) : cart.map(item => (
                                <div key={item.id} style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.brandName}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.genericName} {item.strength} · ${item.sellingPrice.toFixed(2)}/{item.unit.replace(/s$/, '').toLowerCase()}</div>
                                        </div>
                                        <button onClick={() => dispatch(removeFromCart(item.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4 }}><Trash2 size={14} /></button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 7, overflow: 'hidden' }}>
                                            <button onClick={() => item.qty > 1 ? dispatch(updateCartQty({ id: item.id, qty: item.qty - 1 })) : dispatch(removeFromCart(item.id))} style={{ width: 28, height: 28, background: 'var(--sidebar-bg)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                                            <span style={{ width: 32, textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>{item.qty}</span>
                                            <button onClick={() => dispatch(updateCartQty({ id: item.id, qty: Math.min(item.qty + 1, item.currentStock) }))} style={{ width: 28, height: 28, background: 'var(--sidebar-bg)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                                        </div>
                                        <strong style={{ color: 'var(--primary)' }}>${(item.sellingPrice * item.qty).toFixed(2)}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div style={{ padding: '12px 18px', borderTop: '2px solid var(--border)', background: 'var(--sidebar-bg)' }}>
                            {[
                                ['Subtotal', `$${subtotal.toFixed(2)}`],
                                [`GST (avg ${(avgGst * 100).toFixed(0)}%)`, `$${gstAmount.toFixed(2)}`],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '3px 0', color: 'var(--text-muted)' }}>
                                    <span>{k}</span><span>{v}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '4px 0', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Discount ($)</span>
                                <input type="number" min="0" style={{ width: 70, padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.82rem', textAlign: 'right' }} value={discount} onChange={e => setDiscount(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 4px', borderTop: '1px solid var(--border)', marginTop: 8 }}>
                                <strong style={{ fontSize: '1rem' }}>Grand Total</strong>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--success)' }}>${Math.max(0, total).toFixed(2)}</strong>
                            </div>
                        </div>

                        {/* Payment + Complete */}
                        <div style={{ padding: '12px 18px' }}>
                            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Payment Method</label>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                                {PAYMENT_METHODS.map(pm => (
                                    <button key={pm} onClick={() => setPaymentMethod(pm)} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${paymentMethod === pm ? 'var(--primary)' : 'var(--border)'}`, background: paymentMethod === pm ? 'var(--primary)' : 'transparent', color: paymentMethod === pm ? '#fff' : 'var(--text-secondary)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: paymentMethod === pm ? 700 : 400 }}>
                                        {pm}
                                    </button>
                                ))}
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '12px' }} disabled={cart.length === 0} onClick={handleCompleteSale}>
                                <Check size={16} /> Complete Sale & Generate Bill
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bill Receipt Modal ─────────────────────────── */}
            {billModal && (
                <div className="modal-overlay" onClick={() => setBillModal(null)}>
                    <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header" style={{ background: 'var(--primary)', color: '#fff' }}>
                            <h3>🧾 Sale Complete!</h3>
                            <button className="modal-close" style={{ color: '#fff' }} onClick={() => setBillModal(null)}>×</button>
                        </div>
                        <div style={{ padding: '20px 24px', fontFamily: 'monospace' }}>
                            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>🏥 MediCare Hospital Pharmacy</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bill: {billModal.billNumber} · {billModal.time}</div>
                                <div style={{ fontSize: '0.78rem' }}>Patient: {billModal.patient}</div>
                            </div>
                            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 12, marginBottom: 12 }}>
                                {billModal.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
                                        <div>
                                            <div>{item.name}</div>
                                            <div style={{ color: 'var(--text-muted)' }}>Qty: {item.qty} × ${item.price.toFixed(2)}</div>
                                        </div>
                                        <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 10 }}>
                                {[['Subtotal', `$${billModal.subtotal.toFixed(2)}`], ['GST', `$${billModal.gst.toFixed(2)}`], ['Discount', `-$${billModal.discount.toFixed(2)}`]].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 3 }}>
                                        <span>{k}</span><span>{v}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, borderTop: '1px dashed var(--border)', paddingTop: 8, marginTop: 6 }}>
                                    <span>TOTAL</span><span style={{ color: 'var(--success)' }}>${billModal.total.toFixed(2)}</span>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Payment: {billModal.payment} · Thank you!
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ padding: '10px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button className="btn btn-outline" onClick={() => setBillModal(null)}>✅ Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

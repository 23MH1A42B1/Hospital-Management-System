import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Eye, X, CheckCircle } from 'lucide-react';
import { markPaid } from '../../slices/billingSlice';

function InvoiceModal({ bill, onClose }) {
    const dispatch = useDispatch();
    const [payMethod, setPayMethod] = useState('Card');
    if (!bill) return null;
    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <div>
                        <h2>Invoice #{bill.invoiceNumber}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Date: {bill.date}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>🏥 MediCare Hospital</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>123, Medical Campus, Bengaluru - 560001</div>
                        </div>
                        <span className={`badge badge-${bill.status}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>{bill.status.toUpperCase()}</span>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Bill To:</div>
                        <div>{bill.patientName}</div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-main)' }}>
                                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700 }}>Description</th>
                                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}>Qty</th>
                                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700 }}>Unit Price</th>
                                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700 }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.items.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px', fontSize: '0.875rem' }}>{item.description}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.875rem' }}>{item.quantity}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.875rem' }}>₹{item.unitPrice.toLocaleString()}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.875rem' }}>₹{item.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: 260 }}>
                            {[['Subtotal', `₹${bill.subtotal.toLocaleString()}`], ['Tax (5%)', `₹${bill.tax.toLocaleString()}`], ['Discount', `-₹${bill.discount.toLocaleString()}`]].map(([l, v]) => (
                                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span>{l}</span><span>{v}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 800, fontSize: '1.1rem' }}>
                                <span>Total</span><span>₹{bill.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {bill.status === 'pending' || bill.status === 'overdue' ? (
                        <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-main)', borderRadius: 10 }}>
                            <div style={{ fontWeight: 600, marginBottom: 12 }}>Process Payment</div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <select className="form-control" style={{ maxWidth: 200 }} value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                                    {['Cash', 'Card', 'Insurance', 'Online'].map(m => <option key={m}>{m}</option>)}
                                </select>
                                <button className="btn btn-success" onClick={() => { dispatch(markPaid({ id: bill.id, paymentMethod: payMethod })); onClose(); }}>
                                    <CheckCircle size={16} /> Mark as Paid
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginTop: 12, color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={16} /> Paid via {bill.paymentMethod} on {bill.paidAt}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default function BillingManagement() {
    const bills = useSelector(s => s.billing.list);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewBill, setViewBill] = useState(null);

    const filtered = bills.filter(b =>
        (statusFilter === 'all' || b.status === statusFilter) &&
        (b.patientName?.toLowerCase().includes(search.toLowerCase()) || b.invoiceNumber?.includes(search))
    );

    const totalRevenue = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.total, 0);
    const totalPending = bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.total, 0);
    const totalOverdue = bills.filter(b => b.status === 'overdue').reduce((s, b) => s + b.total, 0);

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Billing Management</h2>
                    <p>{bills.length} invoices total</p>
                </div>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
                <div className="kpi-card green"><div className="kpi-icon green" style={{ fontSize: '1.4rem' }}>₹</div><div className="kpi-info"><div className="kpi-value">₹{(totalRevenue / 1000).toFixed(1)}K</div><div className="kpi-label">Collected Revenue</div></div></div>
                <div className="kpi-card orange"><div className="kpi-icon orange" style={{ fontSize: '1.4rem' }}>₹</div><div className="kpi-info"><div className="kpi-value">₹{(totalPending / 1000).toFixed(1)}K</div><div className="kpi-label">Pending Payments</div></div></div>
                <div className="kpi-card red"><div className="kpi-icon red" style={{ fontSize: '1.4rem' }}>₹</div><div className="kpi-info"><div className="kpi-value">₹{(totalOverdue / 1000).toFixed(1)}K</div><div className="kpi-label">Overdue Payments</div></div></div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3>All Invoices</h3>
                    <div style={{ display: 'flex', gap: 12, flex: 1, marginLeft: 12 }}>
                        <div className="search-box"><Search size={15} className="search-icon" /><input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                        <select className="form-control" style={{ maxWidth: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Invoice #</th><th>Patient</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(bill => (
                                <tr key={bill.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{bill.invoiceNumber}</td>
                                    <td><strong>{bill.patientName}</strong></td>
                                    <td>{bill.date}</td>
                                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{bill.items.length} item{bill.items.length !== 1 ? 's' : ''}</span></td>
                                    <td><strong>₹{bill.total.toLocaleString()}</strong></td>
                                    <td>{bill.paymentMethod || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                    <td><span className={`badge badge-${bill.status}`}>{bill.status}</span></td>
                                    <td><button className="btn btn-ghost btn-sm" onClick={() => setViewBill(bill)}><Eye size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer"><span>{filtered.length} invoices</span></div>
            </div>

            {viewBill && <InvoiceModal bill={viewBill} onClose={() => setViewBill(null)} />}
        </div>
    );
}

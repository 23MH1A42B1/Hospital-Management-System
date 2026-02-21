import { useSelector } from 'react-redux';
import { FileText, Download, Eye, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

function BillModal({ bill, onClose }) {
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>🏥 MediCare Hospital</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Bengaluru - 560001</div>
                        </div>
                        <span className={`badge badge-${bill.status}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>{bill.status.toUpperCase()}</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-main)' }}>
                                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.8rem' }}>Description</th>
                                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.8rem' }}>Qty</th>
                                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.8rem' }}>Unit Price</th>
                                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.8rem' }}>Amount</th>
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
                            {[['Subtotal', `₹${bill.subtotal?.toLocaleString()}`], ['Tax (5%)', `₹${bill.tax?.toLocaleString()}`], ['Discount', `-₹${bill.discount?.toLocaleString()}`]].map(([l, v]) => (
                                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span>{l}</span><span>{v}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 800, fontSize: '1.1rem' }}>
                                <span>Total</span><span>₹{bill.total?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    {bill.status === 'paid' && (
                        <div style={{ color: '#059669', fontWeight: 600, display: 'flex', gap: 6 }}>
                            <CheckCircle size={16} /> Paid via {bill.paymentMethod} on {bill.paidAt}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary" onClick={() => alert('PDF download coming soon!')}><Download size={14} /> Download PDF</button>
                </div>
            </div>
        </div>
    );
}

export default function BillingHistory() {
    const { currentUser } = useSelector(s => s.auth);
    const bills = useSelector(s => s.billing.list.filter(b => b.patientId === currentUser?.patientId));
    const [viewBill, setViewBill] = useState(null);

    const total = bills.reduce((s, b) => s + (b.total || 0), 0);
    const paid = bills.filter(b => b.status === 'paid').reduce((s, b) => s + (b.total || 0), 0);
    const pending = bills.filter(b => b.status === 'pending').reduce((s, b) => s + (b.total || 0), 0);

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Billing History</h2>
                    <p>{bills.length} invoices</p>
                </div>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
                <div className="kpi-card blue"><div className="kpi-icon blue" style={{ fontSize: '1.2rem' }}>₹</div><div className="kpi-info"><div className="kpi-value">₹{total.toLocaleString()}</div><div className="kpi-label">Total Billed</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green" style={{ fontSize: '1.2rem' }}>✅</div><div className="kpi-info"><div className="kpi-value">₹{paid.toLocaleString()}</div><div className="kpi-label">Amount Paid</div></div></div>
                <div className="kpi-card orange"><div className="kpi-icon orange" style={{ fontSize: '1.2rem' }}>⏳</div><div className="kpi-info"><div className="kpi-value">₹{pending.toLocaleString()}</div><div className="kpi-label">Amount Pending</div></div></div>
            </div>

            {bills.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><FileText size={40} /></div>
                    <h3>No billing records</h3>
                </div>
            ) : (
                <div className="table-container">
                    <div className="table-header"><h3>All Invoices</h3></div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr><th>Invoice #</th><th>Date</th><th>Items</th><th>Subtotal</th><th>Tax</th><th>Total</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {bills.map(bill => (
                                    <tr key={bill.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{bill.invoiceNumber}</td>
                                        <td>{bill.date}</td>
                                        <td>{bill.items.length}</td>
                                        <td>₹{bill.subtotal?.toLocaleString()}</td>
                                        <td>₹{bill.tax?.toLocaleString()}</td>
                                        <td><strong>₹{bill.total?.toLocaleString()}</strong></td>
                                        <td><span className={`badge badge-${bill.status}`}>{bill.status}</span></td>
                                        <td>
                                            <button className="btn btn-ghost btn-sm" onClick={() => setViewBill(bill)}><Eye size={14} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {viewBill && <BillModal bill={viewBill} onClose={() => setViewBill(null)} />}
        </div>
    );
}

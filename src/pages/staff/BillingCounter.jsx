import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DollarSign, Search, Plus, Printer, Check, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useToast } from '../../components/Toast';

const SERVICES = [
    { id: 's1', name: 'Consultation Fee – General Medicine', amount: 300 },
    { id: 's2', name: 'Consultation Fee – Cardiology', amount: 800 },
    { id: 's3', name: 'Consultation Fee – Neurology', amount: 1000 },
    { id: 's4', name: 'Consultation Fee – Orthopedics', amount: 1200 },
    { id: 's5', name: 'Consultation Fee – Pediatrics', amount: 600 },
    { id: 's6', name: 'ECG Test', amount: 350 },
    { id: 's7', name: 'Blood Test – CBC', amount: 400 },
    { id: 's8', name: 'Blood Sugar – Fasting & PP', amount: 250 },
    { id: 's9', name: 'Urine Routine', amount: 150 },
    { id: 's10', name: 'X-Ray (Single View)', amount: 500 },
    { id: 's11', name: 'X-Ray (Two Views)', amount: 800 },
    { id: 's12', name: 'Ultrasound Abdomen', amount: 1200 },
    { id: 's13', name: 'CT Scan – Head', amount: 3500 },
    { id: 's14', name: 'MRI Brain', amount: 8500 },
    { id: 's15', name: 'Echocardiogram (Echo)', amount: 2500 },
    { id: 's16', name: 'Dressing / Wound Care', amount: 200 },
    { id: 's17', name: 'Injection (Administration charge)', amount: 100 },
    { id: 's18', name: 'Bed Charge – General (per day)', amount: 800 },
    { id: 's19', name: 'Bed Charge – Semi-Private (per day)', amount: 1500 },
    { id: 's20', name: 'Bed Charge – Private Room (per day)', amount: 3000 },
    { id: 's21', name: 'ICU Charge (per day)', amount: 8000 },
    { id: 's22', name: 'Ambulance Service', amount: 1500 },
];

const TAX_RATE = 0.05;
const PAYMENT_ICONS = { cash: Banknote, card: CreditCard, upi: Smartphone, insurance: DollarSign };
const PAYMENT_LABELS = { cash: 'Cash', card: 'Card', upi: 'UPI / Wallet', insurance: 'Insurance' };

export default function BillingCounter() {
    const patients = useSelector(s => s.patients.list);
    const toast = useToast();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [serviceSearch, setServiceSearch] = useState('');
    const [items, setItems] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('cash');
    const [insuranceCover, setInsuranceCover] = useState(0);
    const [amountReceived, setAmountReceived] = useState('');
    const [paid, setPaid] = useState(false);
    const [billNumber] = useState(() => `INV-2024-${String(Math.floor(Math.random() * 9000 + 1000))}`);

    const filteredPatients = patients.filter(p =>
        patientSearch && (p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.patientId.toLowerCase().includes(patientSearch.toLowerCase()))
    ).slice(0, 5);

    const filteredServices = SERVICES.filter(s =>
        s.name.toLowerCase().includes(serviceSearch.toLowerCase())
    ).slice(0, 8);

    const addItem = (svc) => {
        if (items.find(i => i.id === svc.id)) return;
        setItems(prev => [...prev, { ...svc, qty: 1 }]);
        setServiceSearch('');
    };

    const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
    const updateQty = (id, qty) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));

    const subtotal = items.reduce((s, i) => s + i.amount * i.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax - discount;
    const insAdjusted = paymentMode === 'insurance' ? Math.min(Number(insuranceCover) || 0, total) : 0;
    const patientDue = total - insAdjusted;
    const change = Number(amountReceived) > patientDue ? Number(amountReceived) - patientDue : 0;

    const processBill = () => {
        if (!selectedPatient) { toast({ type: 'warning', title: 'No Patient', message: 'Please select a patient first' }); return; }
        if (items.length === 0) { toast({ type: 'warning', title: 'No Services', message: 'Add at least one service' }); return; }
        setPaid(true);
        toast({ type: 'success', title: 'Payment Processed!', message: `Bill ${billNumber} — ₹${patientDue.toLocaleString()}` });
    };

    if (paid) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: 36 }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Check size={32} color="var(--success)" />
                    </div>
                    <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Payment Successful!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Bill #{billNumber}</p>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Patient</span><strong>{selectedPatient?.name}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Insurance</span><strong>₹{insAdjusted.toLocaleString()}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Patient Paid</span><strong style={{ color: 'var(--success)' }}>₹{patientDue.toLocaleString()}</strong></div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setItems([]); setSelectedPatient(null); setPatientSearch(''); setPaid(false); setDiscount(0); setInsuranceCover(0); setAmountReceived(''); }}><Plus size={14} /> New Bill</button>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.print()}><Printer size={14} /> Print Receipt</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Billing Counter</h2>
                    <p>Generate invoices and process payments</p>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--primary)', background: 'var(--primary-light)', padding: '6px 14px', borderRadius: 8 }}>Bill # {billNumber}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
                {/* Left: Patient + Services */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Patient search */}
                    <div className="card">
                        <div className="card-title">Select Patient</div>
                        <div className="search-box" style={{ marginBottom: 8 }}>
                            <Search size={15} className="search-icon" />
                            <input placeholder="Search by name or patient ID..." value={patientSearch} onChange={e => { setPatientSearch(e.target.value); setSelectedPatient(null); }} />
                        </div>
                        {filteredPatients.length > 0 && !selectedPatient && (
                            <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                                {filteredPatients.map(p => (
                                    <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(p.name); }} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.patientId} · {p.age}y · {p.gender}</div>
                                        </div>
                                        {p.insurance && <span style={{ fontSize: '0.72rem', background: 'var(--success-light)', color: 'var(--success)', padding: '2px 8px', borderRadius: 20, height: 'fit-content', marginTop: 4 }}>Insured</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedPatient && (
                            <div style={{ padding: 14, background: 'var(--primary-light)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{selectedPatient.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{selectedPatient.patientId} · {selectedPatient.age}y · {selectedPatient.bloodGroup}</div>
                                    {selectedPatient.insurance && <div style={{ fontSize: '0.75rem', marginTop: 2 }}>Insurance: {selectedPatient.insurance.provider}</div>}
                                </div>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setSelectedPatient(null); setPatientSearch(''); }}>✕</button>
                            </div>
                        )}
                    </div>

                    {/* Service search */}
                    <div className="card">
                        <div className="card-title">Add Services</div>
                        <div className="search-box" style={{ marginBottom: 12 }}>
                            <Search size={15} className="search-icon" />
                            <input placeholder="Search services (e.g. ECG, Blood Test, Consultation)..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} />
                        </div>
                        {serviceSearch && filteredServices.length > 0 && (
                            <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                                {filteredServices.map(s => (
                                    <div key={s.id} onClick={() => addItem(s)} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <span>{s.name}</span>
                                        <strong style={{ color: 'var(--primary)' }}>₹{s.amount}</strong>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Items table */}
                        {items.length > 0 ? (
                            <table style={{ width: '100%', fontSize: '0.88rem' }}>
                                <thead><tr style={{ background: 'var(--bg-secondary)' }}><th style={{ padding: '8px 12px', textAlign: 'left' }}>Service</th><th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th><th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount</th><th style={{ padding: '8px 4px' }}></th></tr></thead>
                                <tbody>
                                    {items.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '10px 12px' }}>{item.name}</td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <input type="number" value={item.qty} min={1} onChange={e => updateQty(item.id, Number(e.target.value))} style={{ width: 50, textAlign: 'center', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 6px' }} />
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>₹{(item.amount * item.qty).toLocaleString()}</td>
                                            <td style={{ padding: '10px 4px', textAlign: 'center' }}><button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1rem' }}>×</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                                <Plus size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
                                <p style={{ margin: 0 }}>Search and add services above</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Summary + Payment */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="card">
                        <div className="card-title">Bill Summary</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><strong>₹{subtotal.toLocaleString()}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax (5%)</span><span>₹{tax.toLocaleString()}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Discount (₹)</span>
                                <input type="number" value={discount} min={0} max={subtotal} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} style={{ width: 80, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', textAlign: 'right', fontSize: '0.9rem' }} />
                            </div>
                            <div style={{ borderTop: '2px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>₹{total.toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title">Payment Method</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                            {Object.entries(PAYMENT_LABELS).map(([key, label]) => {
                                const Icon = PAYMENT_ICONS[key];
                                return (
                                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `2px solid ${paymentMode === key ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', background: paymentMode === key ? 'var(--primary-light)' : 'transparent', transition: 'all 0.15s' }}>
                                        <input type="radio" hidden checked={paymentMode === key} onChange={() => setPaymentMode(key)} />
                                        <Icon size={16} color={paymentMode === key ? 'var(--primary)' : 'var(--text-muted)'} />
                                        <span style={{ fontWeight: paymentMode === key ? 600 : 400, fontSize: '0.88rem' }}>{label}</span>
                                    </label>
                                );
                            })}
                        </div>
                        {paymentMode === 'insurance' && (
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label">Insurance Coverage Amount (₹)</label>
                                <input type="number" className="form-input" placeholder="0" value={insuranceCover} onChange={e => setInsuranceCover(e.target.value)} />
                            </div>
                        )}
                        {(paymentMode === 'cash') && (
                            <div style={{ marginBottom: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Amount Received (₹)</label>
                                    <input type="number" className="form-input" placeholder={patientDue} value={amountReceived} onChange={e => setAmountReceived(e.target.value)} />
                                </div>
                                {change > 0 && <div style={{ marginTop: 8, padding: '8px 14px', background: '#dcfce7', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, color: 'var(--success)' }}>💰 Return Change: ₹{change.toLocaleString()}</div>}
                            </div>
                        )}
                        <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, marginBottom: 16, fontSize: '0.92rem' }}>
                            {paymentMode === 'insurance' && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>Insurance Cover</span><span style={{ color: 'var(--success)' }}>– ₹{insAdjusted.toLocaleString()}</span></div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                <span>Patient Due</span>
                                <span style={{ color: 'var(--danger)', fontSize: '1.05rem' }}>₹{patientDue.toLocaleString()}</span>
                            </div>
                        </div>
                        <button className="btn btn-success" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} onClick={processBill}>
                            <Check size={16} /> Process Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

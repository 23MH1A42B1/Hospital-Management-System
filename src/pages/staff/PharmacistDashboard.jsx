import { useSelector } from 'react-redux';
import { Package, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function PharmacistDashboard() {
    const inventory = useSelector(s => s.inventory.list.filter(i => i.category === 'Medicines'));
    const appointments = useSelector(s => s.appointments.list.filter(a => a.status === 'completed'));

    const lowStock = inventory.filter(i => i.currentStock <= i.reorderLevel);
    const expiring = inventory.filter(i => {
        if (!i.expiryDate) return false;
        const days = Math.floor((new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days >= 0 && days <= 30;
    });

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Pharmacist Dashboard</h2>
                    <p>Medicine inventory and prescription management</p>
                </div>
            </div>

            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card blue"><div className="kpi-icon blue"><Package size={22} /></div><div className="kpi-info"><div className="kpi-value">{inventory.length}</div><div className="kpi-label">Medicine Items</div></div></div>
                <div className="kpi-card red"><div className="kpi-icon red"><AlertCircle size={22} /></div><div className="kpi-info"><div className="kpi-value">{lowStock.length}</div><div className="kpi-label">Low Stock</div></div></div>
                <div className="kpi-card orange"><div className="kpi-icon orange"><Clock size={22} /></div><div className="kpi-info"><div className="kpi-value">{expiring.length}</div><div className="kpi-label">Expiring Soon</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green"><CheckCircle size={22} /></div><div className="kpi-info"><div className="kpi-value">{appointments.length}</div><div className="kpi-label">Prescriptions from today</div></div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="table-container">
                    <div className="table-header"><h3>⚠️ Low Stock Medicines</h3></div>
                    <div className="table-responsive">
                        <table>
                            <thead><tr><th>Medicine</th><th>Stock</th><th>Reorder Level</th><th>Supplier</th></tr></thead>
                            <tbody>
                                {lowStock.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>✅ All stocks are adequate</td></tr>
                                ) : lowStock.map(item => (
                                    <tr key={item.id}>
                                        <td><strong>{item.name}</strong></td>
                                        <td><span style={{ color: 'var(--danger)', fontWeight: 700 }}>{item.currentStock}</span> {item.unit}</td>
                                        <td>{item.reorderLevel} {item.unit}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{item.supplier}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="table-container">
                    <div className="table-header"><h3>⏰ Expiring Soon (&lt;30 days)</h3></div>
                    <div className="table-responsive">
                        <table>
                            <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Stock</th></tr></thead>
                            <tbody>
                                {expiring.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>✅ No items expiring soon</td></tr>
                                ) : expiring.map(item => {
                                    const days = Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <tr key={item.id}>
                                            <td><strong>{item.name}</strong></td>
                                            <td style={{ fontSize: '0.8rem' }}>{item.batchNumber}</td>
                                            <td><span style={{ color: 'var(--warning)', fontWeight: 600 }}>{item.expiryDate}</span> <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({days}d)</span></td>
                                            <td>{item.currentStock} {item.unit}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

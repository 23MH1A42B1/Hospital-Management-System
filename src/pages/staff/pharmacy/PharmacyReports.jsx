import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Package, AlertTriangle, DollarSign, Clock } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
const TABS = ['Sales Report', 'Low Stock', 'Expiring Medicines', 'Stock Valuation', 'Analytics'];

export default function PharmacyReports() {
    const medicines = useSelector(s => s.pharmacy.medicines);
    const sales = useSelector(s => s.pharmacy.sales);
    const [activeTab, setActiveTab] = useState('Sales Report');

    // ── computed ──────────────────────────────────────────────
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalSalesCount = sales.length;
    const avgOrderValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

    const lowStock = medicines.filter(m => m.status === 'low-stock' || m.status === 'out-of-stock').sort((a, b) => a.currentStock - b.currentStock);
    const expiring = medicines.filter(m => m.status === 'expiring-soon' || m.status === 'expired').sort((a, b) => (a.daysToExpiry ?? 9999) - (b.daysToExpiry ?? 9999));

    // Category breakdown
    const categoryRevenue = medicines.reduce((acc, m) => {
        const key = m.category;
        if (!acc[key]) acc[key] = { name: key, inStock: 0, totalItems: 0, value: 0 };
        acc[key].totalItems++;
        acc[key].inStock += m.currentStock;
        acc[key].value += m.currentStock * m.costPrice;
        return acc;
    }, {});
    const categoryData = Object.values(categoryRevenue);

    // Top selling medicines by totalSold
    const topSellers = [...medicines].sort((a, b) => b.totalSold - a.totalSold).slice(0, 8);
    const topSellersData = topSellers.map(m => ({ name: m.brandName, sold: m.totalSold, revenue: m.totalSold * m.sellingPrice }));

    // Payment method breakdown
    const paymentBreakdown = sales.reduce((acc, s) => {
        acc[s.payment] = (acc[s.payment] || 0) + s.total;
        return acc;
    }, {});
    const paymentData = Object.entries(paymentBreakdown).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));

    // Stock valuation
    const totalCostValue = medicines.reduce((sum, m) => sum + m.currentStock * m.costPrice, 0);
    const totalMRPValue = medicines.reduce((sum, m) => sum + m.currentStock * m.mrp, 0);
    const totalSellingValue = medicines.reduce((sum, m) => sum + m.currentStock * m.sellingPrice, 0);

    // Sales by category mock data for chart
    const salesByCat = medicines.reduce((acc, m) => {
        if (!acc[m.category]) acc[m.category] = { name: m.category.split(' ')[0], sales: 0 };
        acc[m.category].sales += m.totalSold * m.sellingPrice / 1000; // in $K
        return acc;
    }, {});
    const salesCatData = Object.values(salesByCat).sort((a, b) => b.sales - a.sales).slice(0, 6);

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>📊 Pharmacy Reports & Analytics</h2>
                    <p>Sales performance, inventory analysis and expiry tracking</p>
                </div>
            </div>

            {/* ── Summary KPIs ──────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: "Today's Revenue", value: `$${totalRevenue.toFixed(2)}`, color: 'var(--success)', icon: <DollarSign size={18} /> },
                    { label: 'Total Transactions', value: totalSalesCount, color: 'var(--primary)', icon: <TrendingUp size={18} /> },
                    { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, color: '#8b5cf6', icon: <BarChart size={18} /> },
                    { label: 'Items Need Attention', value: lowStock.length + expiring.length, color: 'var(--danger)', icon: <AlertTriangle size={18} /> },
                ].map(k => (
                    <div key={k.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: k.color }}>{k.value}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{k.label}</div>
                            </div>
                            <div style={{ color: k.color, opacity: 0.7 }}>{k.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Tab Navigation ────────────────────────────── */}
            <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border)', marginBottom: 24 }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -2 }}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Sales Report ──────────────────────────────── */}
            {activeTab === 'Sales Report' && (
                <div>
                    <div className="table-container">
                        <div className="table-header"><h3>🧾 Today's Sales Transactions</h3></div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr><th>Bill #</th><th>Time</th><th>Patient</th><th>Items</th><th>Subtotal</th><th>GST</th><th>Discount</th><th>Total</th><th>Payment</th></tr>
                                </thead>
                                <tbody>
                                    {sales.map(s => (
                                        <tr key={s.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.8rem' }}>{s.billNumber}</td>
                                            <td style={{ fontSize: '0.8rem' }}>{s.time}</td>
                                            <td style={{ fontSize: '0.8rem' }}>{s.patient}</td>
                                            <td style={{ fontSize: '0.8rem' }}>{s.items.length} items</td>
                                            <td style={{ fontSize: '0.8rem' }}>${s.subtotal.toFixed(2)}</td>
                                            <td style={{ fontSize: '0.8rem' }}>${s.gst.toFixed(2)}</td>
                                            <td style={{ fontSize: '0.8rem', color: s.discount > 0 ? 'var(--success)' : 'var(--text-muted)' }}>-${s.discount.toFixed(2)}</td>
                                            <td style={{ fontWeight: 700, color: 'var(--success)' }}>${s.total.toFixed(2)}</td>
                                            <td><span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, background: 'var(--primary-light)', color: 'var(--primary)' }}>{s.payment}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ background: 'var(--sidebar-bg)' }}>
                                        <td colSpan={4} style={{ fontWeight: 700, padding: '10px 16px' }}>TOTALS</td>
                                        <td style={{ fontWeight: 700 }}>${sales.reduce((s, t) => s + t.subtotal, 0).toFixed(2)}</td>
                                        <td style={{ fontWeight: 700 }}>${sales.reduce((s, t) => s + t.gst, 0).toFixed(2)}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--success)' }}>-${sales.reduce((s, t) => s + t.discount, 0).toFixed(2)}</td>
                                        <td style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1rem' }}>${totalRevenue.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Low Stock ─────────────────────────────────── */}
            {activeTab === 'Low Stock' && (
                <div className="table-container">
                    <div className="table-header"><h3>⚠️ Low Stock & Out of Stock Report ({lowStock.length} items)</h3></div>
                    <div className="table-responsive">
                        <table>
                            <thead><tr><th>Medicine</th><th>SKU</th><th>Category</th><th>Current Stock</th><th>Reorder Level</th><th>Reorder Qty</th><th>Supplier</th><th>Lead Time</th><th>Status</th></tr></thead>
                            <tbody>
                                {lowStock.map(m => (
                                    <tr key={m.id}>
                                        <td>
                                            <strong style={{ fontSize: '0.87rem' }}>{m.brandName}</strong>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.genericName} {m.strength}</div>
                                        </td>
                                        <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.sku}</td>
                                        <td style={{ fontSize: '0.78rem' }}>{m.category}</td>
                                        <td>
                                            <strong style={{ color: m.currentStock === 0 ? 'var(--danger)' : 'var(--warning)' }}>{m.currentStock}</strong>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}> {m.unit}</span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem' }}>{m.reorderLevel} {m.unit}</td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{m.reorderQty} {m.unit}</td>
                                        <td style={{ fontSize: '0.78rem' }}>{m.supplier}</td>
                                        <td style={{ fontSize: '0.78rem' }}>{m.leadTime} days</td>
                                        <td>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, color: m.status === 'out-of-stock' ? 'var(--danger)' : 'var(--warning)', background: m.status === 'out-of-stock' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)' }}>
                                                {m.status === 'out-of-stock' ? '❌ Out of Stock' : '⚠️ Low Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Expiring Medicines ────────────────────────── */}
            {activeTab === 'Expiring Medicines' && (
                <div className="table-container">
                    <div className="table-header"><h3>⏰ Expiring Medicines Report ({expiring.length} items)</h3></div>
                    <div className="table-responsive">
                        <table>
                            <thead><tr><th>Medicine</th><th>Batch</th><th>Category</th><th>Stock</th><th>Expiry Date</th><th>Days Left</th><th>Action Required</th></tr></thead>
                            <tbody>
                                {expiring.map(m => {
                                    const days = m.daysToExpiry;
                                    const color = days === null || days < 0 ? '#6b7280' : days < 15 ? 'var(--danger)' : 'var(--warning)';
                                    return (
                                        <tr key={m.id}>
                                            <td>
                                                <strong style={{ fontSize: '0.87rem' }}>{m.brandName}</strong>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.genericName} {m.strength}</div>
                                            </td>
                                            <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.batchNumber}</td>
                                            <td style={{ fontSize: '0.78rem' }}>{m.category}</td>
                                            <td style={{ fontSize: '0.82rem' }}>{m.currentStock} {m.unit}</td>
                                            <td style={{ fontWeight: 600, color }}>{m.expiryDate || '—'}</td>
                                            <td>
                                                <span style={{ fontWeight: 700, fontSize: '1rem', color }}>{days !== null && days >= 0 ? days : '—'}</span>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}> days</span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, color, background: `${color}18` }}>
                                                    {days === null || days < 0 ? '🚫 Quarantine & Dispose' : days < 15 ? '⚡ Return to Supplier' : '📦 Accelerate Sales'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Stock Valuation ───────────────────────────── */}
            {activeTab === 'Stock Valuation' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                        {[
                            { label: 'Total Cost Value', value: `$${totalCostValue.toFixed(2)}`, sub: 'Purchase price × stock', color: '#f97316' },
                            { label: 'Total Selling Value', value: `$${totalSellingValue.toFixed(2)}`, sub: 'Selling price × stock', color: 'var(--primary)' },
                            { label: 'Total MRP Value', value: `$${totalMRPValue.toFixed(2)}`, sub: 'MRP × stock', color: 'var(--success)' },
                        ].map(k => (
                            <div key={k.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
                                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color }}>{k.value}</div>
                                <div style={{ fontWeight: 600, marginTop: 4 }}>{k.label}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k.sub}</div>
                            </div>
                        ))}
                    </div>
                    <div className="table-container">
                        <div className="table-header"><h3>📦 Category-wise Stock Valuation</h3></div>
                        <div className="table-responsive">
                            <table>
                                <thead><tr><th>Category</th><th>Items</th><th>Total Units</th><th>Cost Value</th></tr></thead>
                                <tbody>
                                    {categoryData.map(cat => (
                                        <tr key={cat.name}>
                                            <td style={{ fontWeight: 600, fontSize: '0.87rem' }}>{cat.name}</td>
                                            <td>{cat.totalItems}</td>
                                            <td>{cat.inStock}</td>
                                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${cat.value.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Analytics ─────────────────────────────────── */}
            {activeTab === 'Analytics' && (
                <div style={{ display: 'grid', gap: 24 }}>
                    {/* Top Sellers Chart */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                        <h4 style={{ marginBottom: 16 }}>🏆 Top 8 Best-Selling Medicines (All Time)</h4>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={topSellersData} layout="vertical">
                                <XAxis type="number" tick={{ fontSize: 11 }} />
                                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(v) => [`${v} units`, 'Total Sold']} />
                                <Bar dataKey="sold" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                    {topSellersData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Category Sales */}
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                            <h4 style={{ marginBottom: 16 }}>📊 Sales by Category ($K)</h4>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={salesCatData}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip formatter={(v) => [`$${(v * 1000).toFixed(0)}`, 'Revenue']} />
                                    <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]}>
                                        {salesCatData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Payment Breakdown */}
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                            <h4 style={{ marginBottom: 16 }}>💳 Payment Method Breakdown</h4>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: $${value.toFixed(0)}`} labelLine={false}>
                                        {paymentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

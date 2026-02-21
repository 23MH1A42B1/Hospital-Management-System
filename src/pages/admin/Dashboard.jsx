import { useSelector } from 'react-redux';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Users, Calendar, Clock, DollarSign, UserCheck, Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { MONTHLY_REVENUE, DEPT_REVENUE, AGE_DISTRIBUTION } from '../../data/mockData';

const COLORS = ['#1a56db', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

function KpiCard({ icon: Icon, label, value, trend, trendDir, color, sub }) {
    return (
        <div className={`kpi-card ${color}`}>
            <div className={`kpi-icon ${color}`}><Icon size={22} /></div>
            <div className="kpi-info">
                <div className="kpi-value">{value}</div>
                <div className="kpi-label">{label}</div>
                {trend && (
                    <div className={`kpi-trend ${trendDir}`}>
                        {trendDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend} {sub || 'vs last month'}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const patients = useSelector(s => s.patients.list);
    const appointments = useSelector(s => s.appointments.list);
    const inventory = useSelector(s => s.inventory.list);
    const bills = useSelector(s => s.billing.list);

    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter(a => a.date === today);
    const pendingApts = appointments.filter(a => a.status === 'pending');
    const lowStock = inventory.filter(i => i.currentStock <= i.reorderLevel);
    const monthRevenue = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0);
    const activeDoctors = 5;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Admin Dashboard</h2>
                    <p>Overview of hospital operations and analytics</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <KpiCard icon={Users} label="Total Patients" value={patients.length} trend="+12%" trendDir="up" color="blue" />
                <KpiCard icon={Calendar} label="Today's Appointments" value={todayApts.length} trend={`${todayApts.filter(a => a.status === 'approved').length} approved`} trendDir="up" color="green" sub="" />
                <KpiCard icon={Clock} label="Pending Requests" value={pendingApts.length} trend={pendingApts.length > 0 ? 'Needs review' : 'All clear'} trendDir={pendingApts.length > 0 ? 'down' : 'up'} color="orange" sub="" />
                <KpiCard icon={DollarSign} label="Monthly Revenue" value={`₹${(monthRevenue / 1000).toFixed(0)}K`} trend="+8.2%" trendDir="up" color="teal" />
                <KpiCard icon={UserCheck} label="Active Doctors" value={activeDoctors} trend="All on duty" trendDir="up" color="purple" sub="" />
                <KpiCard icon={Package} label="Low Stock Items" value={lowStock.length} trend={lowStock.length > 0 ? 'Action needed' : 'OK'} trendDir={lowStock.length > 0 ? 'down' : 'up'} color={lowStock.length > 0 ? 'red' : 'green'} sub="" />
            </div>

            {/* Low Stock Alert */}
            {lowStock.length > 0 && (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AlertTriangle size={20} color="#d97706" />
                    <div>
                        <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem' }}>Low Stock Alert</div>
                        <div style={{ fontSize: '0.82rem', color: '#b45309' }}>
                            {lowStock.map(i => i.name).join(', ')} — stocks are below reorder level
                        </div>
                    </div>
                </div>
            )}

            {/* Charts Row 1 */}
            <div className="chart-grid" style={{ marginBottom: 24 }}>
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <div className="card-title">Appointment Trends</div>
                            <div className="card-subtitle">Last 6 months</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={MONTHLY_REVENUE}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="appointments" stroke="#1a56db" strokeWidth={2.5} dot={{ r: 4 }} name="Appointments" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <div className="card-title">Patient Age Groups</div>
                            <div className="card-subtitle">Distribution</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={AGE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                                {AGE_DISTRIBUTION.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="chart-grid-equal" style={{ marginBottom: 24 }}>
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <div className="card-title">Monthly Revenue</div>
                            <div className="card-subtitle">₹ (Indian Rupees)</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={MONTHLY_REVENUE}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                            <Bar dataKey="revenue" fill="#059669" radius={[6, 6, 0, 0]} name="Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <div className="card-title">Department Revenue</div>
                            <div className="card-subtitle">This month</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={DEPT_REVENUE} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                            <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} width={90} />
                            <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                            <Bar dataKey="revenue" fill="#1a56db" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Today's Appointments */}
            <div className="table-container">
                <div className="table-header">
                    <h3>Today's Appointments</h3>
                    <span className="badge badge-approved">{todayApts.length} appointments</span>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Apt #</th><th>Patient</th><th>Doctor</th><th>Department</th><th>Time</th><th>Type</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayApts.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No appointments scheduled for today</td></tr>
                            ) : todayApts.map(apt => (
                                <tr key={apt.id}>
                                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{apt.appointmentNumber}</span></td>
                                    <td><strong>{apt.patientName}</strong></td>
                                    <td>{apt.doctorName}</td>
                                    <td>{apt.department}</td>
                                    <td>{apt.time}</td>
                                    <td><span className="badge badge-routine">{apt.visitType}</span></td>
                                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

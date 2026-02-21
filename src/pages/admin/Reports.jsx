import { useSelector } from 'react-redux';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MONTHLY_REVENUE, DEPT_REVENUE, AGE_DISTRIBUTION, GENDER_DISTRIBUTION } from '../../data/mockData';
import { Download } from 'lucide-react';

const COLORS = ['#1a56db', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

export default function Reports() {
    const appointments = useSelector(s => s.appointments.list);
    const patients = useSelector(s => s.patients.list);
    const doctors = useSelector(s => s.doctors.list);

    const completedApts = appointments.filter(a => a.status === 'completed');
    const avgRating = completedApts.filter(a => a.rating).reduce((s, a, _, arr) => s + a.rating / arr.length, 0);

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Reports & Analytics</h2>
                    <p>Comprehensive hospital performance data</p>
                </div>
                <button className="btn btn-secondary"><Download size={16} /> Export All</button>
            </div>

            {/* Summary Row */}
            <div className="kpi-grid" style={{ marginBottom: 28 }}>
                <div className="kpi-card blue"><div className="kpi-icon blue" style={{ fontSize: '1.3rem' }}>👤</div><div className="kpi-info"><div className="kpi-value">{patients.length}</div><div className="kpi-label">Total Registered Patients</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green" style={{ fontSize: '1.3rem' }}>✅</div><div className="kpi-info"><div className="kpi-value">{completedApts.length}</div><div className="kpi-label">Completed Appointments</div></div></div>
                <div className="kpi-card teal"><div className="kpi-icon teal" style={{ fontSize: '1.3rem' }}>⭐</div><div className="kpi-info"><div className="kpi-value">{avgRating ? avgRating.toFixed(1) : '—'}</div><div className="kpi-label">Avg Doctor Rating</div></div></div>
                <div className="kpi-card purple"><div className="kpi-icon purple" style={{ fontSize: '1.3rem' }}>🏥</div><div className="kpi-info"><div className="kpi-value">{doctors.length}</div><div className="kpi-label">Total Doctors</div></div></div>
            </div>

            {/* Charts row 1 */}
            <div className="chart-grid" style={{ marginBottom: 24 }}>
                <div className="chart-card">
                    <div className="chart-header">
                        <div><div className="card-title">Monthly Appointments & Revenue Trend</div><div className="card-subtitle">Last 6 months</div></div>
                        <button className="btn btn-ghost btn-sm"><Download size={14} /></button>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={MONTHLY_REVENUE}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="appointments" stroke="#1a56db" strokeWidth={2.5} dot={{ r: 4 }} name="Appointments" />
                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue (₹)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <div><div className="card-title">Gender Distribution</div></div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={GENDER_DISTRIBUTION} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                                {GENDER_DISTRIBUTION.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts row 2 */}
            <div className="chart-grid-equal" style={{ marginBottom: 24 }}>
                <div className="chart-card">
                    <div className="chart-header">
                        <div><div className="card-title">Department Revenue</div></div>
                        <button className="btn btn-ghost btn-sm"><Download size={14} /></button>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={DEPT_REVENUE}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="dept" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                            <Bar dataKey="revenue" fill="#1a56db" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <div><div className="card-title">Patient Age Distribution</div></div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={AGE_DISTRIBUTION}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={v => [`${v}%`, 'Patients']} />
                            <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} name="%" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Doctor Performance Table */}
            <div className="table-container">
                <div className="table-header">
                    <h3>Doctor Performance Report</h3>
                    <button className="btn btn-ghost btn-sm"><Download size={14} /> Export</button>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Doctor</th><th>Department</th><th>Total Patients</th><th>Experience</th><th>Rating</th><th>Consultation Fee</th></tr>
                        </thead>
                        <tbody>
                            {doctors.map(d => (
                                <tr key={d.id}>
                                    <td><strong>{d.name}</strong></td>
                                    <td>{d.department}</td>
                                    <td>{d.totalPatients.toLocaleString()}</td>
                                    <td>{d.experience} years</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ color: '#f59e0b', fontWeight: 700 }}>⭐ {d.rating}</span>
                                        </div>
                                    </td>
                                    <td>₹{d.consultationFee.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

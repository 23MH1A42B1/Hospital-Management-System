import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Bed, AlertTriangle, ChevronRight, Activity, Thermometer, Droplets } from 'lucide-react';

const STATUS_COLORS = { critical: 'var(--danger)', unstable: 'var(--warning)', stable: 'var(--success)', improving: 'var(--info)' };
const STATUS_BG = { critical: '#fef2f2', unstable: '#fffbeb', stable: '#f0fdf4', improving: '#eff6ff' };

export default function NursePatients() {
    const patients = useSelector(s => s.nurse.patients);
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const filtered = patients.filter(p => filter === 'all' || p.status === filter);

    const getLastVitals = (p) => p.vitalsHistory[p.vitalsHistory.length - 1] || null;
    const getPendingOrders = (p) => p.orders.filter(o => !o.completed).length;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>My Patients</h2>
                    <p>Inpatients under your care today</p>
                </div>
            </div>

            {/* Quick stats */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card red"><div className="kpi-icon red"><AlertTriangle size={22} /></div><div className="kpi-info"><div className="kpi-value">{patients.filter(p => p.status === 'critical').length}</div><div className="kpi-label">Critical</div></div></div>
                <div className="kpi-card orange"><div className="kpi-icon orange"><Activity size={22} /></div><div className="kpi-info"><div className="kpi-value">{patients.filter(p => p.status === 'unstable').length}</div><div className="kpi-label">Unstable</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green"><Heart size={22} /></div><div className="kpi-info"><div className="kpi-value">{patients.filter(p => p.status === 'stable').length}</div><div className="kpi-label">Stable</div></div></div>
                <div className="kpi-card blue"><div className="kpi-icon blue"><User size={22} /></div><div className="kpi-info"><div className="kpi-value">{patients.length}</div><div className="kpi-label">Total Patients</div></div></div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['all', 'critical', 'unstable', 'stable', 'improving'].map(f => (
                    <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.83rem', padding: '6px 16px', textTransform: 'capitalize' }} onClick={() => setFilter(f)}>
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filtered.map(p => {
                    const vitals = getLastVitals(p);
                    const pendingOrders = getPendingOrders(p);
                    return (
                        <div key={p.id} className="card" style={{ borderLeft: `4px solid ${STATUS_COLORS[p.status]}`, background: STATUS_BG[p.status], cursor: 'pointer' }} onClick={() => navigate(`/nurse/patients/${p.id}/vitals`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 12, background: STATUS_COLORS[p.status], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                                        {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{p.name}</h3>
                                            <span style={{ background: STATUS_COLORS[p.status], color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>{p.status}</span>
                                            {pendingOrders > 0 && <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600 }}>{pendingOrders} pending orders</span>}
                                        </div>
                                        <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                            <span><strong>{p.age}y {p.gender}</strong></span>
                                            <span><Bed size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />{p.bedId} · {p.ward}</span>
                                            <span>👨‍⚕️ {p.doctorName}</span>
                                            <span>📋 {p.diagnosis}</span>
                                        </div>
                                        {p.allergies.length > 0 && (
                                            <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                                                {p.allergies.map(a => <span key={a} style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '1px 8px', fontSize: '0.72rem', fontWeight: 500 }}>⚠️ {a}</span>)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    {vitals && (
                                        <div style={{ display: 'flex', gap: 16, fontSize: '0.83rem', background: 'rgba(255,255,255,0.7)', padding: '8px 14px', borderRadius: 10 }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 700, color: vitals.hr > 100 ? 'var(--danger)' : 'var(--text)' }}>{vitals.hr}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>HR/min</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 700, color: vitals.spo2 < 94 ? 'var(--danger)' : 'var(--text)' }}>{vitals.spo2}%</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>SpO₂</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 700 }}>{vitals.bp}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>BP</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 700 }}>{vitals.temp}°F</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Temp</div>
                                            </div>
                                        </div>
                                    )}
                                    <ChevronRight size={20} color="var(--text-muted)" />
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="empty-state"><p>No {filter === 'all' ? '' : filter} patients</p></div>
                )}
            </div>
        </div>
    );
}

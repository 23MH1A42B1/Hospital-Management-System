import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ClipboardList, CheckSquare, AlertCircle, Circle, Filter } from 'lucide-react';
import { completeOrder } from '../../../slices/nurseSlice';
import { useToast } from '../../../components/Toast';

const ORDER_TYPE_ICON = {
    vital: '📊', medication: '💊', lab: '🧪', wound: '🩹',
    mobility: '🚶', diet: '🍽️', procedure: '🩺', other: '📋',
};
const PRIORITY_COLORS = { urgent: 'var(--danger)', routine: 'var(--info)', stat: 'var(--danger)', prn: 'var(--warning)' };
const PRIORITY_BG = { urgent: '#fef2f2', routine: '#eff6ff', stat: '#fef2f2', prn: '#fffbeb' };

export default function NurseOrders() {
    const patients = useSelector(s => s.nurse.patients);
    const dispatch = useDispatch();
    const toast = useToast();
    const [filter, setFilter] = useState('pending');

    const allOrders = patients.flatMap(p =>
        p.orders.map(o => ({ ...o, patientName: p.name, patientId: p.id, status: p.status, bedId: p.bedId }))
    );

    const filtered = allOrders.filter(o =>
        filter === 'all' || (filter === 'pending' && !o.completed) || (filter === 'done' && o.completed)
    );

    // Sort: urgent first, then by time
    const sorted = [...filtered].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
        return 0;
    });

    const handleComplete = (o) => {
        dispatch(completeOrder({ patientId: o.patientId, orderId: o.id }));
        toast({ type: 'success', title: 'Order Completed', message: `${o.text.slice(0, 40)}...` });
    };

    const pending = allOrders.filter(o => !o.completed).length;
    const urgent = allOrders.filter(o => !o.completed && o.priority === 'urgent').length;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Nurse Orders</h2>
                    <p>Doctor orders and nursing tasks across all patients</p>
                </div>
                {urgent > 0 && (
                    <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: 10, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertCircle size={16} color="#dc2626" />
                        <span style={{ fontWeight: 600, color: '#dc2626' }}>{urgent} Urgent</span>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                <div className="kpi-card blue"><div className="kpi-icon blue"><ClipboardList size={22} /></div><div className="kpi-info"><div className="kpi-value">{allOrders.length}</div><div className="kpi-label">Total Orders</div></div></div>
                <div className="kpi-card orange"><div className="kpi-icon orange"><Circle size={22} /></div><div className="kpi-info"><div className="kpi-value">{pending}</div><div className="kpi-label">Pending</div></div></div>
                <div className="kpi-card red"><div className="kpi-icon red"><AlertCircle size={22} /></div><div className="kpi-info"><div className="kpi-value">{urgent}</div><div className="kpi-label">Urgent</div></div></div>
                <div className="kpi-card green"><div className="kpi-icon green"><CheckSquare size={22} /></div><div className="kpi-info"><div className="kpi-value">{allOrders.filter(o => o.completed).length}</div><div className="kpi-label">Completed</div></div></div>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['pending', 'done', 'all'].map(f => (
                    <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.83rem', padding: '6px 16px', textTransform: 'capitalize' }} onClick={() => setFilter(f)}>
                        {f === 'pending' ? `⏳ Pending (${pending})` : f === 'done' ? '✅ Completed' : 'All Orders'}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sorted.length === 0 && <div className="empty-state"><p>No orders in this category</p></div>}
                {sorted.map(o => (
                    <div key={o.id} className="card" style={{ padding: 18, background: o.completed ? 'transparent' : PRIORITY_BG[o.priority] || 'var(--bg)', border: `1px solid ${o.completed ? 'var(--border)' : PRIORITY_COLORS[o.priority] || 'var(--border)'}`, opacity: o.completed ? 0.6 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: 2 }}>{ORDER_TYPE_ICON[o.type] || '📋'}</div>
                                <div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 600 }}>{o.text}</span>
                                        {!o.completed && (
                                            <span style={{ background: PRIORITY_COLORS[o.priority], color: '#fff', borderRadius: 20, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{o.priority}</span>
                                        )}
                                        {o.completed && <span style={{ background: 'var(--success-light)', color: 'var(--success)', borderRadius: 20, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>✓ Done</span>}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                                        <span>🧑‍⚕️ {o.patientName}</span>
                                        <span>🛏 {o.bedId}</span>
                                        <span>⏰ Due: {o.dueTime}</span>
                                        <span style={{ textTransform: 'capitalize' }}>Type: {o.type}</span>
                                    </div>
                                </div>
                            </div>
                            {!o.completed && (
                                <button className="btn btn-success" style={{ fontSize: '0.8rem', padding: '6px 14px', flexShrink: 0 }} onClick={() => handleComplete(o)}>
                                    <CheckSquare size={13} /> Mark Done
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

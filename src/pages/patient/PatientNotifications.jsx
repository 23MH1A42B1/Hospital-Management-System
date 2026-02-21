import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCheck } from 'lucide-react';
import { markRead, markAllRead, dismiss } from '../../slices/notificationsSlice';
import { formatDistanceToNow } from 'date-fns';

const TYPE_ICONS = {
    appointment_approved: '🎉',
    appointment_rejected: '❌',
    appointment_request: '📋',
    appointment_reminder: '⏰',
    low_stock: '📦',
    system: '🔔',
};

export default function PatientNotifications() {
    const { currentUser } = useSelector(s => s.auth);
    const notifications = useSelector(s =>
        s.notifications.list.filter(n => n.userId === currentUser?.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    );
    const dispatch = useDispatch();
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Notifications</h2>
                    <p>{notifications.filter(n => !n.read).length} unread</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div className="tabs" style={{ alignSelf: 'center' }}>
                        <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`tab-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
                            Unread {notifications.filter(n => !n.read).length > 0 && <span className="tab-count">{notifications.filter(n => !n.read).length}</span>}
                        </button>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => dispatch(markAllRead(currentUser?.id))}>
                        <CheckCheck size={14} /> Mark All Read
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><Bell size={40} /></div>
                    <h3>No notifications</h3>
                    <p>You're all caught up!</p>
                </div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    {filtered.map((n, i) => (
                        <div key={n.id} style={{ padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', background: n.read ? 'transparent' : 'var(--primary-light)', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start' }}
                            onClick={() => !n.read && dispatch(markRead(n.id))}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                                {TYPE_ICONS[n.type] || '🔔'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <div style={{ fontWeight: n.read ? 500 : 700 }}>{n.title}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: 12 }}>
                                        {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'just now'}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</div>
                            </div>
                            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 6 }} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

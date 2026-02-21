import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCheck } from 'lucide-react';
import { markAllRead, markRead } from '../slices/notificationsSlice';
import { formatDistanceToNow } from 'date-fns';

const typeIcons = {
    appointment_request: '📋',
    appointment_approved: '✅',
    appointment_rejected: '❌',
    reminder: '⏰',
    low_stock: '📦',
    expiry_alert: '⚠️',
    info: 'ℹ️',
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const { currentUser } = useSelector(s => s.auth);
    const notifications = useSelector(s => s.notifications.list.filter(n => n.userId === currentUser?.id));
    const unreadCount = notifications.filter(n => !n.read).length;
    const dispatch = useDispatch();
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={ref}>
            <button className="notif-btn" onClick={() => setOpen(o => !o)}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
            </button>

            {open && (
                <div className="notif-dropdown">
                    <div className="notif-dropdown-header">
                        <h4>Notifications {unreadCount > 0 && <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>({unreadCount} new)</span>}</h4>
                        {unreadCount > 0 && (
                            <button className="btn btn-ghost btn-sm" onClick={() => dispatch(markAllRead(currentUser.id))} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <CheckCheck size={12} /> Mark all read
                            </button>
                        )}
                    </div>
                    <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Bell size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                                <p style={{ fontSize: '0.82rem' }}>No notifications</p>
                            </div>
                        ) : (
                            notifications.slice(0, 15).map(n => (
                                <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => dispatch(markRead(n.id))}>
                                    {!n.read && <div className="notif-dot" />}
                                    <div style={{ flex: 1 }}>
                                        <div className="notif-title">{typeIcons[n.type] || 'ℹ️'} {n.title}</div>
                                        <div className="notif-msg">{n.message}</div>
                                        <div className="notif-time">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

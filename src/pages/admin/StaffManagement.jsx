import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, X } from 'lucide-react';
import { addStaff, deactivateStaff } from '../../slices/staffSlice';

const ROLES = ['doctor', 'nurse', 'receptionist', 'pharmacist', 'admin'];
const DEPTS = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Pharmacy', 'Front Desk', 'General Medicine', 'Administration'];

function StaffModal({ onClose }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ name: '', role: 'nurse', department: 'General Medicine', phone: '', email: '', shift: 'Morning', salary: '', joinDate: new Date().toISOString().split('T')[0], status: 'active' });
    const set = (f, v) => setForm(x => ({ ...x, [f]: v }));
    const handleSubmit = (e) => {
        e.preventDefault();
        const count = Math.floor(1000 + Math.random() * 9000);
        dispatch(addStaff({ ...form, employeeId: `EMP-2024-${count}`, id: `s_${Date.now()}` }));
        onClose();
    };
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Add Staff Member</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Full Name <span className="required">*</span></label>
                                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select className="form-control" value={form.role} onChange={e => set('role', e.target.value)}>
                                    {ROLES.map(r => <option key={r} value={r} style={{ textTransform: 'capitalize' }}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select className="form-control" value={form.department} onChange={e => set('department', e.target.value)}>
                                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Shift</label>
                                <select className="form-control" value={form.shift} onChange={e => set('shift', e.target.value)}>
                                    <option>Morning</option><option>Evening</option><option>Night</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Monthly Salary (₹)</label>
                                <input type="number" className="form-control" value={form.salary} onChange={e => set('salary', +e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Join Date</label>
                                <input type="date" className="form-control" value={form.joinDate} onChange={e => set('joinDate', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Staff</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const roleColors = { doctor: 'avatar-teal', nurse: 'avatar-green', receptionist: 'avatar-orange', pharmacist: 'avatar-red', admin: 'avatar-blue' };
function getInitials(name) { return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'; }

export default function StaffManagement() {
    const staff = useSelector(s => s.staff.list);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [roleFilter, setRoleFilter] = useState('all');

    const filtered = staff.filter(s =>
        (roleFilter === 'all' || s.role === roleFilter) &&
        (s.name.toLowerCase().includes(search.toLowerCase()) || s.employeeId?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h2>Staff Management</h2>
                    <p>{staff.filter(s => s.status === 'active').length} active staff members</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Staff</button>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
                {ROLES.map(role => (
                    <div key={role} className="card" style={{ textAlign: 'center', cursor: 'pointer', border: roleFilter === role ? '2px solid var(--primary)' : undefined }} onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{staff.filter(s => s.role === role).length}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 4 }}>{role}s</div>
                    </div>
                ))}
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3>All Staff</h3>
                    <div style={{ display: 'flex', gap: 12, flex: 1, marginLeft: 12 }}>
                        <div className="search-box">
                            <Search size={15} className="search-icon" />
                            <input placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="form-control" style={{ maxWidth: 140 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                            <option value="all">All Roles</option>
                            {ROLES.map(r => <option key={r} value={r} style={{ textTransform: 'capitalize' }}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                        </select>
                    </div>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Employee</th><th>Role</th><th>Department</th><th>Phone</th><th>Shift</th><th>Salary</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className={`avatar avatar-sm ${roleColors[s.role] || 'avatar-blue'}`}>{getInitials(s.name)}</div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{s.name}</div>
                                                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.employeeId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-routine" style={{ textTransform: 'capitalize' }}>{s.role}</span></td>
                                    <td>{s.department}</td>
                                    <td>{s.phone}</td>
                                    <td>{s.shift}</td>
                                    <td>₹{(s.salary || 0).toLocaleString()}</td>
                                    <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                                    <td>
                                        {s.status === 'active' && (
                                            <button className="btn btn-danger btn-sm" onClick={() => dispatch(deactivateStaff(s.id))}>Deactivate</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer"><span>{filtered.length} staff members</span></div>
            </div>
            {showAdd && <StaffModal onClose={() => setShowAdd(false)} />}
        </div>
    );
}

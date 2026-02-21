import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, AlertCircle, Clock, X } from 'lucide-react';
import { addItem, restock, deleteItem } from '../../slices/inventorySlice';

const CATEGORIES = ['Medicines', 'Equipment', 'Surgical Supplies', 'General Supplies'];

function getStockStatus(current, reorder) {
    const pct = (current / reorder) * 100;
    if (current <= reorder * 0.5) return 'critical';
    if (current <= reorder) return 'low';
    return 'ok';
}

function getExpiryStatus(expiryDate) {
    if (!expiryDate) return null;
    const days = Math.floor((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { label: 'Expired', cls: 'badge-rejected' };
    if (days <= 30) return { label: `Expires in ${days}d`, cls: 'badge-expiring' };
    if (days <= 90) return { label: `Exp: ${expiryDate}`, cls: 'badge-routine' };
    return null;
}

function RestockModal({ item, onClose }) {
    const dispatch = useDispatch();
    const [qty, setQty] = useState(100);
    return (
        <div className="modal-overlay">
            <div className="modal modal-sm">
                <div className="modal-header">
                    <h2>Restock: {item.name}</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>Current stock: <strong>{item.currentStock} {item.unit}</strong> (Reorder level: {item.reorderLevel})</p>
                    <div className="form-group">
                        <label className="form-label">Quantity to Add</label>
                        <input type="number" className="form-control" value={qty} onChange={e => setQty(+e.target.value)} min={1} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => { dispatch(restock({ id: item.id, quantity: qty })); onClose(); }}>Confirm Restock</button>
                </div>
            </div>
        </div>
    );
}

function AddItemModal({ onClose }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ name: '', category: 'Medicines', currentStock: 0, unit: 'Units', reorderLevel: 50, costPrice: 0, sellingPrice: 0, expiryDate: '', supplier: '', supplierContact: '', batchNumber: '', location: '' });
    const set = (f, v) => setForm(x => ({ ...x, [f]: v }));
    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h2>Add Inventory Item</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); dispatch(addItem({ ...form, id: `inv_${Date.now()}` })); onClose(); }}>
                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Item Name <span className="required">*</span></label>
                                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Unit</label>
                                <input className="form-control" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="Tablets, Units, Bottles..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Current Stock</label>
                                <input type="number" className="form-control" value={form.currentStock} onChange={e => set('currentStock', +e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Reorder Level</label>
                                <input type="number" className="form-control" value={form.reorderLevel} onChange={e => set('reorderLevel', +e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cost Price (₹)</label>
                                <input type="number" step="0.01" className="form-control" value={form.costPrice} onChange={e => set('costPrice', +e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Selling Price (₹)</label>
                                <input type="number" step="0.01" className="form-control" value={form.sellingPrice} onChange={e => set('sellingPrice', +e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Expiry Date</label>
                                <input type="date" className="form-control" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Supplier</label>
                                <input className="form-control" value={form.supplier} onChange={e => set('supplier', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Batch Number</label>
                                <input className="form-control" value={form.batchNumber} onChange={e => set('batchNumber', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input className="form-control" value={form.location} onChange={e => set('location', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function InventoryManagement() {
    const inventory = useSelector(s => s.inventory.list);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const [showAdd, setShowAdd] = useState(false);
    const [restockItem, setRestockItem] = useState(null);

    const filtered = inventory.filter(i =>
        (catFilter === 'all' || i.category === catFilter) &&
        i.name.toLowerCase().includes(search.toLowerCase())
    );

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
                    <h2>Inventory Management</h2>
                    <p>{inventory.length} items tracked</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Item</button>
            </div>

            {/* Alerts */}
            {(lowStock.length > 0 || expiring.length > 0) && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    {lowStock.length > 0 && (
                        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 18px', flex: 1, minWidth: 200, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <AlertCircle color="#dc2626" size={18} />
                            <div>
                                <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.88rem' }}>{lowStock.length} Low Stock Items</div>
                                <div style={{ fontSize: '0.78rem', color: '#b91c1c' }}>{lowStock.slice(0, 3).map(i => i.name).join(', ')}{lowStock.length > 3 ? '...' : ''}</div>
                            </div>
                        </div>
                    )}
                    {expiring.length > 0 && (
                        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', flex: 1, minWidth: 200, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <Clock color="#d97706" size={18} />
                            <div>
                                <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.88rem' }}>{expiring.length} Items Expiring Within 30 Days</div>
                                <div style={{ fontSize: '0.78rem', color: '#b45309' }}>{expiring.slice(0, 3).map(i => i.name).join(', ')}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="table-container">
                <div className="table-header">
                    <h3>All Inventory</h3>
                    <div style={{ display: 'flex', gap: 12, flex: 1, marginLeft: 12 }}>
                        <div className="search-box"><Search size={15} className="search-icon" /><input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                        <select className="form-control" style={{ maxWidth: 180 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Item Name</th><th>Category</th><th>Stock Level</th><th>Reorder At</th><th>Expiry</th><th>Cost / Sell</th><th>Supplier</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => {
                                const stockStatus = getStockStatus(item.currentStock, item.reorderLevel);
                                const expiryInfo = getExpiryStatus(item.expiryDate);
                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Batch: {item.batchNumber} · {item.location}</div>
                                        </td>
                                        <td><span className="badge badge-routine">{item.category}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div>
                                                    <span style={{ fontWeight: 700, color: stockStatus === 'critical' ? 'var(--danger)' : stockStatus === 'low' ? 'var(--warning)' : 'var(--text-primary)' }}>
                                                        {item.currentStock}
                                                    </span>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}> {item.unit}</span>
                                                </div>
                                                {stockStatus !== 'ok' && <span className={`badge badge-${stockStatus === 'critical' ? 'rejected' : 'pending'}`}>{stockStatus === 'critical' ? 'Critical' : 'Low'}</span>}
                                            </div>
                                            <div className="stock-bar"><div className="stock-bar-fill" style={{ width: `${Math.min(100, (item.currentStock / item.reorderLevel) * 100 / 2)}%` }} /></div>
                                        </td>
                                        <td>{item.reorderLevel} {item.unit}</td>
                                        <td>{expiryInfo ? <span className={`badge ${expiryInfo.cls}`}>{expiryInfo.label}</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{item.expiryDate || 'N/A'}</span>}</td>
                                        <td><div style={{ fontSize: '0.82rem' }}>₹{item.costPrice} / ₹{item.sellingPrice}</div></td>
                                        <td><div style={{ fontSize: '0.82rem' }}>{item.supplier}</div></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="btn btn-primary btn-sm" onClick={() => setRestockItem(item)}>Restock</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => dispatch(deleteItem(item.id))}>Remove</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="table-footer"><span>{filtered.length} items shown</span></div>
            </div>

            {showAdd && <AddItemModal onClose={() => setShowAdd(false)} />}
            {restockItem && <RestockModal item={restockItem} onClose={() => setRestockItem(null)} />}
        </div>
    );
}

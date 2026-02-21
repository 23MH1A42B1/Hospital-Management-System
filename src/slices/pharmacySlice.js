import { createSlice } from '@reduxjs/toolkit';
import { MOCK_MEDICINES, MOCK_PRESCRIPTIONS } from '../data/mockData';

// ── helpers ─────────────────────────────────────────────────
const getDaysToExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    return Math.floor((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
};

const getStockStatus = (med) => {
    if (med.currentStock === 0) return 'out-of-stock';
    const days = getDaysToExpiry(med.expiryDate);
    if (days !== null && days < 0) return 'expired';
    if (days !== null && days <= 30) return 'expiring-soon';
    if (med.currentStock <= med.reorderLevel) return 'low-stock';
    return 'in-stock';
};

// Seed with computed status
const seedMedicines = MOCK_MEDICINES.map(m => ({
    ...m,
    status: getStockStatus(m),
    daysToExpiry: getDaysToExpiry(m.expiryDate),
}));

// Seed today's sample sales
const SEED_SALES = [
    { id: 'sale001', billNumber: 'INV-2026-00567', time: '09:15 AM', patient: 'Walk-in Customer', items: [{ name: 'Crocin (Paracetamol 500mg)', qty: 2, unit: 'Strips', price: 2.50 }, { name: 'Zyrtec (Cetirizine 10mg)', qty: 1, unit: 'Strips', price: 1.80 }], subtotal: 6.80, gst: 0.82, discount: 0, total: 7.62, payment: 'Cash' },
    { id: 'sale002', billNumber: 'INV-2026-00566', time: '10:30 AM', patient: 'Ravi Kumar', items: [{ name: 'Ecosprin (Aspirin 75mg)', qty: 2, unit: 'Strips', price: 1.20 }, { name: 'Lipitor (Atorvastatin 10mg)', qty: 2, unit: 'Strips', price: 5.00 }], subtotal: 12.40, gst: 1.49, discount: 1.00, total: 12.89, payment: 'Card' },
    { id: 'sale003', billNumber: 'INV-2026-00565', time: '11:45 AM', patient: 'Meera Singh', items: [{ name: 'Prilosec (Omeprazole 20mg)', qty: 1, unit: 'Strips', price: 3.50 }, { name: 'Digene Syrup', qty: 1, unit: 'Bottle', price: 3.00 }], subtotal: 6.50, gst: 0.78, discount: 0, total: 7.28, payment: 'UPI' },
    { id: 'sale004', billNumber: 'INV-2026-00564', time: '12:20 PM', patient: 'Walk-in Customer', items: [{ name: 'Vitamin C 500mg (Celin)', qty: 3, unit: 'Strips', price: 1.50 }], subtotal: 4.50, gst: 0, discount: 0, total: 4.50, payment: 'Cash' },
    { id: 'sale005', billNumber: 'INV-2026-00563', time: '02:00 PM', patient: 'Arjun Nair', items: [{ name: 'Glycomet (Metformin 500mg)', qty: 4, unit: 'Strips', price: 2.80 }, { name: 'Amaryl (Glimepiride 2mg)', qty: 2, unit: 'Strips', price: 6.20 }], subtotal: 23.60, gst: 2.83, discount: 2.00, total: 24.43, payment: 'Insurance' },
];

const pharmacySlice = createSlice({
    name: 'pharmacy',
    initialState: {
        medicines: seedMedicines,
        prescriptions: MOCK_PRESCRIPTIONS,
        sales: SEED_SALES,
        cart: [],
    },
    reducers: {
        // ── Cart ──
        addToCart: (state, { payload: { medicine, qty } }) => {
            const existing = state.cart.find(i => i.id === medicine.id);
            if (existing) {
                existing.qty = Math.min(existing.qty + qty, medicine.currentStock);
            } else {
                state.cart.push({ ...medicine, qty });
            }
        },
        updateCartQty: (state, { payload: { id, qty } }) => {
            const item = state.cart.find(i => i.id === id);
            if (item) item.qty = qty;
        },
        removeFromCart: (state, { payload: id }) => {
            state.cart = state.cart.filter(i => i.id !== id);
        },
        clearCart: (state) => { state.cart = []; },

        // ── Complete Sale ──
        completeSale: (state, { payload: saleRecord }) => {
            state.sales.unshift(saleRecord);
            // Reduce stock
            saleRecord.items.forEach(item => {
                const med = state.medicines.find(m => m.id === item.medicineId);
                if (med) {
                    med.currentStock = Math.max(0, med.currentStock - item.qty);
                    med.totalSold = (med.totalSold || 0) + item.qty;
                    med.lastSoldDate = new Date().toISOString().split('T')[0];
                    med.status = getStockStatus(med);
                }
            });
            state.cart = [];
        },

        // ── Dispense Prescription ──
        dispensePrescription: (state, { payload: rxId }) => {
            const rx = state.prescriptions.find(p => p.id === rxId);
            if (!rx) return;
            rx.medicines.forEach(item => {
                const med = state.medicines.find(m => m.id === item.medicineId);
                if (med && med.currentStock >= item.qty) {
                    med.currentStock -= item.qty;
                    med.totalSold = (med.totalSold || 0) + item.qty;
                    med.lastSoldDate = new Date().toISOString().split('T')[0];
                    med.status = getStockStatus(med);
                }
            });
            rx.status = 'completed';
            rx.dispensedOn = new Date().toISOString().split('T')[0];
        },

        // ── Restock ──
        restockMedicine: (state, { payload: { id, qty, batchNumber, expiryDate } }) => {
            const med = state.medicines.find(m => m.id === id);
            if (!med) return;
            med.currentStock += qty;
            if (batchNumber) med.batchNumber = batchNumber;
            if (expiryDate) {
                med.expiryDate = expiryDate;
                med.daysToExpiry = getDaysToExpiry(expiryDate);
            }
            med.lastPurchaseDate = new Date().toISOString().split('T')[0];
            med.status = getStockStatus(med);
        },

        // ── Update medicine ──
        updateMedicine: (state, { payload }) => {
            const idx = state.medicines.findIndex(m => m.id === payload.id);
            if (idx !== -1) {
                state.medicines[idx] = { ...payload, status: getStockStatus(payload), daysToExpiry: getDaysToExpiry(payload.expiryDate) };
            }
        },
    },
});

export const { addToCart, updateCartQty, removeFromCart, clearCart, completeSale, dispensePrescription, restockMedicine, updateMedicine } = pharmacySlice.actions;
export default pharmacySlice.reducer;

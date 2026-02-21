import { createSlice } from '@reduxjs/toolkit';
import { MOCK_BILLS } from '../data/mockData';

const billingSlice = createSlice({
    name: 'billing',
    initialState: { list: MOCK_BILLS },
    reducers: {
        addBill: (state, action) => { state.list.unshift({ ...action.payload, id: `bill_${Date.now()}` }); },
        markPaid: (state, action) => {
            const { id, paymentMethod } = action.payload;
            const bill = state.list.find(b => b.id === id);
            if (bill) { bill.status = 'paid'; bill.paymentMethod = paymentMethod; bill.paidAt = new Date().toISOString().split('T')[0]; }
        },
        updateBill: (state, action) => {
            const idx = state.list.findIndex(b => b.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        },
    },
});

export const { addBill, markPaid, updateBill } = billingSlice.actions;
export default billingSlice.reducer;

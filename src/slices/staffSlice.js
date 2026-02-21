import { createSlice } from '@reduxjs/toolkit';
import { MOCK_STAFF } from '../data/mockData';

const staffSlice = createSlice({
    name: 'staff',
    initialState: { list: MOCK_STAFF },
    reducers: {
        addStaff: (state, action) => { state.list.push({ ...action.payload, id: `s_${Date.now()}` }); },
        updateStaff: (state, action) => {
            const idx = state.list.findIndex(s => s.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        },
        deactivateStaff: (state, action) => {
            const s = state.list.find(s => s.id === action.payload);
            if (s) s.status = 'inactive';
        },
    },
});

export const { addStaff, updateStaff, deactivateStaff } = staffSlice.actions;
export default staffSlice.reducer;

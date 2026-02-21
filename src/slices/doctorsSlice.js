import { createSlice } from '@reduxjs/toolkit';
import { MOCK_DOCTORS } from '../data/mockData';

const doctorsSlice = createSlice({
    name: 'doctors',
    initialState: { list: MOCK_DOCTORS },
    reducers: {
        updateDoctor: (state, action) => {
            const idx = state.list.findIndex(d => d.id === action.payload.id);
            if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
        },
    },
});

export const { updateDoctor } = doctorsSlice.actions;
export default doctorsSlice.reducer;

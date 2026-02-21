import { createSlice } from '@reduxjs/toolkit';
import { MOCK_PATIENTS } from '../data/mockData';

const patientsSlice = createSlice({
    name: 'patients',
    initialState: { list: MOCK_PATIENTS, search: '' },
    reducers: {
        addPatient: (state, action) => { state.list.push(action.payload); },
        updatePatient: (state, action) => {
            const idx = state.list.findIndex(p => p.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        },
        setSearch: (state, action) => { state.search = action.payload; },
    },
});

export const { addPatient, updatePatient, setSearch } = patientsSlice.actions;
export default patientsSlice.reducer;

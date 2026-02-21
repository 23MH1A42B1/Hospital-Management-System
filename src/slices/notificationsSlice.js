import { createSlice } from '@reduxjs/toolkit';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: { list: MOCK_NOTIFICATIONS },
    reducers: {
        addNotification: (state, action) => {
            state.list.unshift({ ...action.payload, id: `n_${Date.now()}`, read: false, createdAt: new Date().toISOString() });
        },
        markRead: (state, action) => {
            const n = state.list.find(n => n.id === action.payload);
            if (n) n.read = true;
        },
        markAllRead: (state, action) => {
            state.list.filter(n => n.userId === action.payload).forEach(n => { n.read = true; });
        },
        dismiss: (state, action) => {
            state.list = state.list.filter(n => n.id !== action.payload);
        },
    },
});

export const { addNotification, markRead, markAllRead, dismiss } = notificationsSlice.actions;
export default notificationsSlice.reducer;

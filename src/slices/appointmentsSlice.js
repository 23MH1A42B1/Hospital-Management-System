import { createSlice } from '@reduxjs/toolkit';
import { MOCK_APPOINTMENTS } from '../data/mockData';

const generateAppointmentNumber = () => {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `APT-2024-${num}`;
};

const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState: { list: MOCK_APPOINTMENTS },
    reducers: {
        addAppointment: (state, action) => {
            const newApt = {
                ...action.payload,
                id: `apt_${Date.now()}`,
                appointmentNumber: generateAppointmentNumber(),
                status: 'pending',
                createdAt: new Date().toISOString(),
                approvedAt: null,
                notes: '',
            };
            state.list.unshift(newApt);
        },
        approveAppointment: (state, action) => {
            const { id, notes } = action.payload;
            const apt = state.list.find(a => a.id === id);
            if (apt) {
                apt.status = 'approved';
                apt.notes = notes || '';
                apt.approvedAt = new Date().toISOString();
            }
        },
        rejectAppointment: (state, action) => {
            const { id, reason } = action.payload;
            const apt = state.list.find(a => a.id === id);
            if (apt) {
                apt.status = 'rejected';
                apt.rejectionReason = reason;
            }
        },
        rescheduleAppointment: (state, action) => {
            const { id, newDate, newTime, reason } = action.payload;
            const apt = state.list.find(a => a.id === id);
            if (apt) {
                apt.status = 'rescheduled';
                apt.proposedDate = newDate;
                apt.proposedTime = newTime;
                apt.rescheduleReason = reason;
            }
        },
        markCompleted: (state, action) => {
            const apt = state.list.find(a => a.id === action.payload);
            if (apt) apt.status = 'completed';
        },
        markNoShow: (state, action) => {
            const apt = state.list.find(a => a.id === action.payload);
            if (apt) apt.status = 'no_show';
        },
        cancelAppointment: (state, action) => {
            const apt = state.list.find(a => a.id === action.payload);
            if (apt) apt.status = 'cancelled';
        },
        addReview: (state, action) => {
            const { id, rating, review } = action.payload;
            const apt = state.list.find(a => a.id === id);
            if (apt) { apt.rating = rating; apt.review = review; }
        },
    },
});

export const { addAppointment, approveAppointment, rejectAppointment, rescheduleAppointment, markCompleted, markNoShow, cancelAppointment, addReview } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;

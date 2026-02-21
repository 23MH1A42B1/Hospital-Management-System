import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import patientsReducer from '../slices/patientsSlice';
import appointmentsReducer from '../slices/appointmentsSlice';
import doctorsReducer from '../slices/doctorsSlice';
import inventoryReducer from '../slices/inventorySlice';
import billingReducer from '../slices/billingSlice';
import notificationsReducer from '../slices/notificationsSlice';
import staffReducer from '../slices/staffSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        patients: patientsReducer,
        appointments: appointmentsReducer,
        doctors: doctorsReducer,
        inventory: inventoryReducer,
        billing: billingReducer,
        notifications: notificationsReducer,
        staff: staffReducer,
    },
});

export default store;

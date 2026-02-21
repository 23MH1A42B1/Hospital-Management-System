import { createSlice } from '@reduxjs/toolkit';
import { MOCK_USERS } from '../data/mockData';

const storedUser = localStorage.getItem('hms_user');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: storedUser ? JSON.parse(storedUser) : null,
        isAuthenticated: !!storedUser,
        error: null,
    },
    reducers: {
        login: (state, action) => {
            const { email, password } = action.payload;
            const user = MOCK_USERS.find(u => u.email === email && u.password === password);
            if (user) {
                const { password: _, ...safeUser } = user;
                state.currentUser = safeUser;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('hms_user', JSON.stringify(safeUser));
            } else {
                state.error = 'Invalid email or password';
            }
        },
        loginAsRole: (state, action) => {
            const role = action.payload;
            const user = MOCK_USERS.find(u => u.role === role);
            if (user) {
                const { password: _, ...safeUser } = user;
                state.currentUser = safeUser;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('hms_user', JSON.stringify(safeUser));
            }
        },
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('hms_user');
        },
        clearError: (state) => { state.error = null; },
    },
});

export const { login, loginAsRole, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

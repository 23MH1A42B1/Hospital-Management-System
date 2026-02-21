import { createSlice } from '@reduxjs/toolkit';
import { MOCK_INVENTORY } from '../data/mockData';

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: { list: MOCK_INVENTORY },
    reducers: {
        addItem: (state, action) => { state.list.push({ ...action.payload, id: `inv_${Date.now()}` }); },
        updateItem: (state, action) => {
            const idx = state.list.findIndex(i => i.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        },
        restock: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.list.find(i => i.id === id);
            if (item) item.currentStock += quantity;
        },
        deleteItem: (state, action) => {
            state.list = state.list.filter(i => i.id !== action.payload);
        },
    },
});

export const { addItem, updateItem, restock, deleteItem } = inventorySlice.actions;
export default inventorySlice.reducer;

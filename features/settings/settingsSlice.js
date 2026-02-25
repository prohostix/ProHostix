import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    async (_, { getState, rejectWithValue }) => {
        const { settings } = getState();
        if (settings.data) return settings.data;

        try {
            const res = await api.get('/settings');
            return res;
        } catch (err) {
            return rejectWithValue(err.message || 'Failed to fetch settings');
        }
    }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        data: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.isLoading = !state.data;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default settingsSlice.reducer;

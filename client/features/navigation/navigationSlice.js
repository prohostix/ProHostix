import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { NAVIGATION } from '../../data/staticContent';

export const fetchNavigation = createAsyncThunk(
    'navigation/fetchNavigation',
    async (_, { getState, rejectWithValue }) => {
        const { navigation } = getState();
        if (navigation.items.length > 0) return navigation.items; // Don't re-fetch if we already have it

        try {
            const res = await api.get('/navigation');
            if (Array.isArray(res)) {
                return res.sort((a, b) => (a.order || 0) - (b.order || 0));
            }
            return NAVIGATION; // Fallback if API returns non-array
        } catch (err) {
            // Silently fallback to static data on error
            return NAVIGATION;
        }
    }
);

const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        items: NAVIGATION,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNavigation.pending, (state) => {
                // If we have items (even from static), we don't need to show loading skeleton
                state.isLoading = state.items.length === 0;
            })
            .addCase(fetchNavigation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchNavigation.rejected, (state, action) => {
                state.isLoading = false;
                // If async thunk itself fails completely (rare with our try/catch above), use static
                if (state.items.length === 0) {
                    state.items = NAVIGATION;
                }
                state.error = action.payload;
            });
    },
});

export default navigationSlice.reducer;

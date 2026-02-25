import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { NAV_ITEMS } from '../../config/home/navigationContent';

export const performSearch = createAsyncThunk(
    'search/performSearch',
    async (query, { rejectWithValue }) => {
        try {
            if (query.length < 1) return { results: [], query };
            const data = await api.get(`/search?q=${query}`);

            // 1. Static Navigation Items
            const navResults = NAV_ITEMS
                .filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
                .map(item => ({
                    title: item.label,
                    path: item.path,
                    category: 'Navigation',
                    isNav: true
                }));

            // 2. Transformed Backend Results
            const dynamicResults = [
                ...(data.blogs || []).map(b => ({ ...b, category: b.category || 'Blog', path: `/blog/${b.slug}` })),
                ...(data.services || []).map(s => ({ ...s, category: 'Service', path: '/services' })),
                ...(data.caseStudies || []).map(c => ({ ...c, category: 'Case Study', path: `/case-studies/${c.slug}` })),
                ...(data.solutions || []).map(s => ({ ...s, category: 'Solution', path: `/solutions/${s.slug}` })),
                ...(data.team || []).map(t => ({ title: t.name, category: t.role, path: '/company' })),
                ...(data.jobs || []).map(j => ({ ...j, category: 'Careers', path: '/company' }))
            ];

            return { results: [...navResults, ...dynamicResults], query };
        } catch (err) {
            return rejectWithValue(err.message || 'Search failed');
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        results: [],
        isSearching: false,
        isExpanded: false,
        error: null,
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
            if (action.payload === '') {
                state.results = [];
            }
        },
        toggleSearch: (state) => {
            state.isExpanded = !state.isExpanded;
            if (!state.isExpanded) {
                state.query = '';
                state.results = [];
            }
        },
        setSearchExpanded: (state, action) => {
            state.isExpanded = action.payload;
            if (!action.payload) {
                state.query = '';
                state.results = [];
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(performSearch.pending, (state) => {
                state.isSearching = true;
            })
            .addCase(performSearch.fulfilled, (state, action) => {
                state.isSearching = false;
                state.results = action.payload.results;
                state.error = null;
            })
            .addCase(performSearch.rejected, (state, action) => {
                state.isSearching = false;
                state.error = action.payload;
            });
    },
});

export const { setQuery, toggleSearch, setSearchExpanded } = searchSlice.actions;
export default searchSlice.reducer;

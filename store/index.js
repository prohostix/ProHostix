import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../features/search/searchSlice';
import navigationReducer from '../features/navigation/navigationSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
    reducer: {
        search: searchReducer,
        navigation: navigationReducer,
        settings: settingsReducer,
    },
});

export default store;

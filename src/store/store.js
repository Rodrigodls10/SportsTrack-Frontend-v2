import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth.slice";
import activitiesReducer from "../features/activities.slice";
import categoriesReducer from "../features/categories.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        activities: activitiesReducer,
        categories: categoriesReducer
    }
});
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    actividades: [],
    paginacion: null
};

const activitiesSlice = createSlice({
    name: "activities",
    initialState,
    reducers: {
        cargarActividades: (state, action) => {
            state.actividades = action.payload.actividades;
            state.paginacion = action.payload.paginacion;
        },

        limpiarActividades: (state) => {
            state.actividades = [];
            state.paginacion = null;
        }
    }
});

export const {
    cargarActividades,
    limpiarActividades
} = activitiesSlice.actions;

export default activitiesSlice.reducer;
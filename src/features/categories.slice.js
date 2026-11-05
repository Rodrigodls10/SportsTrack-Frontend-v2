import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categorias: []
};

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        cargarCategorias: (state, action) => {
            state.categorias = action.payload;
        },

        limpiarCategorias: (state) => {
            state.categorias = [];
        }
    }
});

export const {
    cargarCategorias,
    limpiarCategorias
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
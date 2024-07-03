import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filteredProducts: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    FILTER_PRODUCTS(state, action) {
      const { products, search } = action.payload;
      state.filteredProducts = products.filter((product) => {
        const skuCode = product.skuCode || "";
        return skuCode.toLowerCase().includes(search.toLowerCase());
      });
    },
  },
});

export const { FILTER_PRODUCTS } = filterSlice.actions;
export const selectFilteredProducts = (state) => state.filter.filteredProducts;
export default filterSlice.reducer;

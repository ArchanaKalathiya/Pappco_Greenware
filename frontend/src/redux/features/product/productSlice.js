import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../../services/productService";
import { toast } from "react-toastify";

const initialState = {
    product: null,
    products: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    totalStoreValue: 0,
    outOfStock: 0,
    category: [],
  };
  
  export const createProduct = createAsyncThunk(
    "products/create",
    async (formData, thunkAPI) => {
      try {
        const response = await productService.createProduct(formData);
        return response.data; // Return the created product data
      } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        console.log(message);
        thunkAPI.rejectWithValue(message);
      }
    }
  );
  
  
  // Get all products
  export const getProducts = createAsyncThunk(
    "products/getAll",
    async (_, thunkAPI) => {
      try {
        return await productService.getProducts();
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
  // Delete a Product
  export const deleteProduct = createAsyncThunk(
    "products/delete",
    async (id, thunkAPI) => {
      try {
        return await productService.deleteProduct(id);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
  // Get a product
  export const getProduct = createAsyncThunk(
    "products/getProduct",
    async (id, thunkAPI) => {
      try {
        return await productService.getProduct(id);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  // Update product
  export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, formData }, thunkAPI) => {
      try {
        return await productService.updateProduct(id, formData);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  // Get Available Products
  export const getAvailableProduct = createAsyncThunk(
    "products/getAvailable",
    async(_, thunkAPI) => {
        try {
            return await productService.getAvailableProduct();
        } catch (error) {
            const message = (
                error.response && error.response.data && error.response.data.message
            ) || 
            error.message ||
            error.toString();
            console.log(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
  );

  // Select Product
  export const selectProduct = createAsyncThunk(
    "products/select",
    async ({ productId, quantity, print }, thunkAPI) => {
      try {
        const response = await productService.selectProduct(productId, quantity, print);
        return response;
      } catch (error) {
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
  const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
      CALC_STORE_VALUE(state, action) {
        const products = action.payload;
        const array = [];
        products.map((item) => {
          const { price, quantity } = item;
          const productValue = price * quantity;
          return array.push(productValue);
        });
        const totalValue = array.reduce((a, b) => {
          return a + b;
        }, 0);
        state.totalStoreValue = totalValue;
      },
      CALC_OUTOFSTOCK(state, action) {
        const products = action.payload;
        const array = [];
        products.map((item) => {
          const { noOfquantity } = item;
  
          return array.push(noOfquantity);
        });
        let count = 0;
        array.forEach((number) => {
          if (number === 0 || number === "0") {
            count += 1;
          }
        });
        state.outOfStock = count;
      },
      CALC_CATEGORY(state, action) {
        const products = action.payload;
        const array = [];
        products.map((item) => {
          const { category } = item;
  
          return array.push(category);
        });
        const uniqueCategory = [...new Set(array)];
        state.category = uniqueCategory;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createProduct.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          console.log(action.payload);
          state.products.push(action.payload);
          toast.success("Product added successfully");
        })
        .addCase(createProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
        })
        .addCase(getProducts.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getProducts.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          console.log(action.payload);
          state.products = action.payload;
        })
        .addCase(getProducts.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
        })
        .addCase(deleteProduct.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          toast.success("Product deleted successfully");
        })
        .addCase(deleteProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
        })
        .addCase(getProduct.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.product = action.payload;
        })
        .addCase(getProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
        })
        .addCase(updateProduct.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          toast.success("Product updated successfully");
        })
        .addCase(updateProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
        })
        .addCase(getAvailableProduct.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAvailableProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.products = action.payload || [];
            console.log(action.payload);
            // Handle the available products data as needed
        })
        .addCase(getAvailableProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.error(action.payload);
        })
        .addCase(selectProduct.fulfilled, (state, action) => {
          state.isSuccess = true;
          // Handle the user-specific selection update here if needed
        })
        .addCase(selectProduct.rejected, (state, action) => {
          state.isError = true;
          state.message = action.payload;
        });
    },
  });
  
  export const { CALC_STORE_VALUE, CALC_OUTOFSTOCK, CALC_CATEGORY } =
    productSlice.actions;
  
  export const selectIsLoading = (state) => state.product.isLoading;
  export const selectProducts = (state) => state.product.products;
  export const selectTotalStoreValue = (state) => state.product.totalStoreValue;
  export const selectOutOfStock = (state) => state.product.outOfStock;
  export const selectCategory = (state) => state.product.category;
  
  export default productSlice.reducer;
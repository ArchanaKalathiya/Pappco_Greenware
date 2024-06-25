import { createSlice } from '@reduxjs/toolkit';
const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
  isLoggedIn: false,
  name: name ? name : "",
  user: {
    name: "",
    email: "",
    contact: "",
    address: "",
    postcode: "",
    bio: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USER(state, action) {
      const profile = action.payload || {};
      state.user.name = profile.name || "";
      state.user.email = profile.email || "";
      state.user.contact = profile.contact || "";
      state.user.address = profile.address || "";
      state.user.postcode = profile.postcode || "";
      state.user.bio = profile.bio || "";
    },
    CLEAR_USER(state) {
      state.user = {
        name: "",
        email: "",
        contact: "",
        address: "",
        postcode: "",
        bio: "",
      };
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER, CLEAR_USER } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
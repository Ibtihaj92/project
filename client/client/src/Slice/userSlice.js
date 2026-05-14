import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register new user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/userRegister", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/userLogin", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  user: null,
  msg: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.msg = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.msg = action.payload.serverMsg;
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.msg = action.payload || action.error.message;
      state.loading = false;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.msg = action.payload.serverMsg;
      if (action.payload.loginStatus) {
        state.user = action.payload.user;
      }
      state.loading = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.msg = action.payload || action.error.message;
      state.loading = false;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

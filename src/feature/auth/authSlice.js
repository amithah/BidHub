import { createSlice } from '@reduxjs/toolkit';
import useApi from '../../hooks/useApi';

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null; // Reset error on new login attempt
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload?.data;
      state.isLoading = false;
      state.error = null; // Clear any existing errors on success
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload; // Set error message
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null; // Clear error on logout
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null; // Reset error on new registration attempt
    },
    registerSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload?.data;
      state.isLoading = false;
      state.error = null; // Clear any existing errors on success
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload; // Set error message
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  registerStart, 
  registerSuccess, 
  registerFailure 
} = authSlice.actions;

// Thunk action creator for login using useApi hook
export const loginAsync = (credentials) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();

  try {
    dispatch(loginStart());
    const user = await fetchDataWithHeaders('/login', JSON.stringify(credentials), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure(error.message || 'Login failed'));
    // Handle error here if needed
  }
};

// Thunk action creator for register using useApi hook
export const registerAsync = (credentials) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();

  try {
    dispatch(registerStart());
    const user = await fetchDataWithHeaders('/register', JSON.stringify(credentials), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(registerSuccess(user));
  } catch (error) {
    dispatch(registerFailure(error.message || 'Registration failed'));
    // Handle error here if needed
  }
};

export const selectAuth = (state) => state.auth;
export default authSlice.reducer;

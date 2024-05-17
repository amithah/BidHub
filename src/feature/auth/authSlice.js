import { createSlice } from '@reduxjs/toolkit';
import useApi from '../../hooks/useApi';
 

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload?.data;
      state.isLoading = false;
    },
    loginFailure: (state) => {
      state.isLoading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Thunk action creator for login using useApi hook
export const loginAsync = (credentials) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();

  try {
    dispatch(loginStart());
    const user = await fetchDataWithHeaders('/login',  JSON.stringify(credentials),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure());
    // Handle error here if needed
  }
};

export const selectAuth = (state) => state.auth;
export default authSlice.reducer;

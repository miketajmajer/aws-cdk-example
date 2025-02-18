import { createSlice } from "@reduxjs/toolkit";

export interface AuthAction {
  type: string;
  payload: {
    idToken: string;
    refreshToken: string;
  }
}

const initialState = {
  idToken: localStorage.getItem("idToken"),
  refreshToken: localStorage.getItem("refreshToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authTokenChange: (state, action: AuthAction) => {
      localStorage.setItem("idToken", action.payload.idToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      state.idToken = action.payload.idToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logoutUser: (state) => {
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
      state.idToken = null;
      state.refreshToken = null;
    },
  },
});

export const { authTokenChange, logoutUser } = authSlice.actions;
export { authSlice };
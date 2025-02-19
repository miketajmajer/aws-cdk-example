import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthAction {
  idToken: string;
  refreshToken: string;
}

const initialState = {
  idToken: localStorage.getItem("idToken"),
  refreshToken: localStorage.getItem("refreshToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authTokenChange: (state, action: PayloadAction<AuthAction>) => {
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
  selectors: {
    selectIdToken: (state) => state.idToken,
  }
});

export const { authTokenChange, logoutUser } = authSlice.actions;
export const { selectIdToken } = authSlice.selectors;
export { authSlice };
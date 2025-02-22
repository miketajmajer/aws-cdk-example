import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hub } from 'aws-amplify';
import { generateTemporaryCredentialsThunk } from "../api/authService";

interface AuthAction {
  idToken: string;
  refreshToken: string;
}

// needed for api to access state!
interface AuthState {
  idToken: string | null;
  refreshToken: string | null;
  temporary: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    temporaryCredentials: any;
    temporaryCredentialsLoadingState: 'loading' | 'idle' | 'failed';
    temporaryCredentialsError: string;
  }
}

const initialState = {
  idToken: localStorage.getItem("idToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  temporary: {
    temporaryCredentials: null,
    temporaryCredentialsLoadingState: 'idle',
    temporaryCredentialsError: '',
  },
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticationUser(state, action: PayloadAction<AuthAction>) {
      state.idToken = action.payload.idToken;
      state.refreshToken = action.payload.refreshToken;
      state.temporary.temporaryCredentials = null;
    },
    authTokenChange: (state, action: PayloadAction<AuthAction>) => {
      localStorage.setItem("idToken", action.payload.idToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      state.idToken = action.payload.idToken;
      state.refreshToken = action.payload.refreshToken;
      state.temporary.temporaryCredentials = null;
    },
    logoutUser: (state) => {
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
      state.idToken = null;
      state.refreshToken = null;
      state.temporary.temporaryCredentials = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTemporaryCredentialsThunk.pending, (state) => {
        state.temporary.temporaryCredentialsLoadingState = 'loading';
        state.temporary.temporaryCredentials = null;
      })
      .addCase(generateTemporaryCredentialsThunk.fulfilled, (state, action) => {
        state.temporary.temporaryCredentials = action.payload;
        state.temporary.temporaryCredentialsLoadingState = 'idle';
      })
      .addCase(generateTemporaryCredentialsThunk.rejected, (state, action) => {
        state.temporary.temporaryCredentialsLoadingState = 'failed';
        state.temporary.temporaryCredentialsError = action.payload as string;
      });
  },
  selectors: {
    selectIdToken: (state): string | null => state.idToken,
    selectTemporaryCredentials: (state): string | null => state.temporary.temporaryCredentials,
  }
});

Hub.listen('auth', (data) => {
  const event = data?.payload?.event;
  console.info(`AWS Amplify Listener: '${event}'`, data);
  switch (event) {
    case 'signIn':
        console.info('Auth signIn event:', data);
        // magic sauce, this populates the slice when login finishes
        authSlice.actions.authTokenChange({ idToken: '', refreshToken: ''});
        break;
      case 'signOut':
        console.info('Auth signOut event:', data);
        authSlice.actions.logoutUser();
        break;
      // add logout into error case
      default:
        break;
    }
});

export const { logoutUser } = authSlice.actions;
export const { selectIdToken, selectTemporaryCredentials } = authSlice.selectors;
export { authSlice };
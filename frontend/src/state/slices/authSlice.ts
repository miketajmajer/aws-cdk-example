import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hub } from 'aws-amplify';
import { generateTemporaryCredentialsThunk } from "../api/authService";

interface AuthAction {
  idToken: string;
  refreshToken: string;
}

// needed for api to access state!
interface AuthState {
  tokens: {
    idToken: string | null;
    refreshToken: string | null;
  }
  temporary: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    loading: 'pending' | 'fulfilled' | 'rejected' | 'undefined';
    error: string;
  }
}

const initialState = {
  //
  // This isn't best practice - for prod code use Cookies with HTTPOnly and SameSite
  // with refresh tokens having a seperate path (/refresh) so they are not sent with every
  // request.
  //
  tokens: {
    idToken: localStorage.getItem("idToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  },
  temporary: {
    data: null,
    loading: 'undefined', // if undefined, we need to make a request
    error: '',
  },
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticationUser(state, action: PayloadAction<AuthAction>) {
      state.tokens.idToken = action.payload.idToken;
      state.tokens.refreshToken = action.payload.refreshToken;
      state.temporary.data = null;
      state.temporary.loading = 'undefined';
    },
    authTokenChange: (state, action: PayloadAction<AuthAction>) => {
      localStorage.setItem("idToken", action.payload.idToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      state.tokens.idToken = action.payload.idToken;
      state.tokens.refreshToken = action.payload.refreshToken;
      state.temporary.data = null;
      state.temporary.loading = 'undefined';
    },
    logoutUser: (state) => {
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
      state.tokens.idToken = null;
      state.tokens.refreshToken = null;
      state.temporary.data = null;
      state.temporary.loading = 'undefined';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTemporaryCredentialsThunk.pending, (state) => {
        state.temporary.loading = 'pending';
        state.temporary.data = null;
      })
      .addCase(generateTemporaryCredentialsThunk.fulfilled, (state, action) => {
        state.temporary.data = action.payload;
        state.temporary.loading = 'fulfilled';
      })
      .addCase(generateTemporaryCredentialsThunk.rejected, (state, action) => {
        state.temporary.loading = 'rejected';
        state.temporary.error = action.error.message as string;
      });
  },
  selectors: {
    selectIdToken: (state): string | null => state.tokens.idToken,
    selectTemporaryCredentials: (state): string | null => state.temporary.data,
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
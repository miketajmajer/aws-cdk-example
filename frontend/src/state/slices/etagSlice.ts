import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthAction {
  url: string;
  etag: string
}

interface EtagState {
  etags: Record<string, string>;
}

const initialState: EtagState = {
  etags: {},
};

const etagSlice = createSlice({
  name: 'etag',
  initialState,
  reducers: {
    setEtag: (state, action: PayloadAction<AuthAction>) => {
      state.etags[action.payload.url] = action.payload.etag;
    },
    removeEtag: (state, action: PayloadAction<{ url: string }>) => {
      delete state.etags[action.payload.url];
    },
  },
  selectors: {
    selectEtag: (state, url) => state.etags[url],
  }
});

export const { setEtag, removeEtag } = etagSlice.actions;
export const { selectEtag } = etagSlice.selectors;
export { etagSlice };
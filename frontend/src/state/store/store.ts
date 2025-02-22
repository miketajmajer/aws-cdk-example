import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { spaceApi } from '../api/spaceApi'
import { authSlice } from "../slices/authSlice";
import { etagSlice } from '../slices/etagSlice';

export const store = configureStore({
  // Add the generated reducer as a specific top-level slice
  reducer: {
    [spaceApi.reducerPath]: spaceApi.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [etagSlice.reducerPath]: etagSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spaceApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself - cannot use this in
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
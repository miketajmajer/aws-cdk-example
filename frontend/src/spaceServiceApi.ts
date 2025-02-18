import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from "./store";

export interface SpaceEntry {
  id: string;
  location: string;
  name: string;
  protoUrl?: string;
}

export const spaceApi = createApi({
  reducerPath: 'spacesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://lki9rp3gpe.execute-api.us-east-1.amazonaws.com/prod/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.idToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSpaces: builder.query<SpaceEntry[], void>({
      query: () => `spaces`,
    }),
    getSpacesById: builder.query<SpaceEntry, string>({
      query: (id) => `spaces?id=${id}`,
    }),
  }),
});

export const { useGetSpacesQuery, useGetSpacesByIdQuery } = spaceApi;
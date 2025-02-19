import { BaseQueryMeta, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store';
import { etagSlice, removeEtag, setEtag } from './etagSlice';
import { authSlice } from './authSlice';

export interface SpaceEntry {
  id: string;
  location: string;
  name: string;
  protoUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const etagUrl = (meta: BaseQueryMeta<any>, id: string = '') => id ? `${meta!.request.url}?id=${id}` : meta!.request.url;

export const spaceApi = createApi({
  reducerPath: 'spacesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://lki9rp3gpe.execute-api.us-east-1.amazonaws.com/prod/spaces',
    prepareHeaders: (headers, { getState, endpoint }) => {
      const state = getState() as RootState;
      const etag = etagSlice.selectors.selectEtag(state, endpoint);
      const token = authSlice.selectors.selectIdToken(state);

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      if (etag) {
        headers.set('If-None-Match', etag);
      }
      return headers;
    },
  }),
  tagTypes: ['SpaceEntry'],
  endpoints: (builder) => ({
    GetAllSpaces: builder.query<SpaceEntry[], void>({
      query: () => ({
        url: '',
        method: 'GET',
      }),
      transformResponse: (response: SpaceEntry[], meta) => {
        if (meta?.response?.headers.get('ETag')) {
          const etag = meta.response.headers.get('ETag')!;
          // set tag for 'all'
          setEtag({ url: etagUrl(meta), etag });
          //
          // Should not touch the individual etags, those individual hashes will not match the 'all' hash
          // response.forEach((item) => setEtag({ url: etagUrl(meta, item.id), etag }));
          //
        } else {
          removeEtag({ url: etagUrl(meta) });
          // response.forEach((item) => removeEtag({ url: etagUrl(meta, item.id) }));
        }
        return response;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      providesTags: (_result) => [{ type: 'SpaceEntry', id: 'LIST' }],
        // Should not touch the individual etags, those individual hashes will not match the 'all' hash
        // result.map(({ id }) => ({ type: 'SpaceEntry', id }))
    }),

    getSpacesById: builder.query<SpaceEntry, string>({
      query: (id) => ({
        url: `?id=${id}`,
        method: 'GET',
      }),
      transformResponse: (response: SpaceEntry, meta, id) => {
        const etag = meta?.response?.headers.get('ETag');
        if (etag) {
          setEtag({ url: etagUrl(meta, id), etag })
        } else {
          removeEtag({ url: etagUrl(meta, id) })
        }
        return response;
      },
      providesTags: (_result, _error, id) => [{ type: 'SpaceEntry', id }],
    }),

    createSpaces: builder.mutation<SpaceEntry, Partial<SpaceEntry>>({
      query: (item) => ({
        url: '',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: () => [{ type: 'SpaceEntry', id: 'LIST' }],
    }),

    updateSpaces: builder.mutation<SpaceEntry, Partial<SpaceEntry>>({
      query: (item) => ({
        url: `?id=${item.id}`,
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'SpaceEntry', id: arg.id }, { type: 'SpaceEntry', id: 'LIST' }],
      onQueryStarted: async (item, { dispatch, queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          dispatch(removeEtag({ url: etagUrl(result.meta, item.id) }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(e: any) {
          console.error('Error in updateSpaces', e);
          throw e; // let
        }
      },
    }),

    deleteSpaces: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'SpaceEntry', id }, { type: 'SpaceEntry', id: 'LIST' }],
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          dispatch(removeEtag({ url: etagUrl(result.meta, id) }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(e: any) {
          console.error('Error in deleteSpaces', e);
          throw e; // let
        }
      },
    }),
  }),
});

export const {
  useGetAllSpacesQuery,
  useGetSpacesByIdQuery,
  useCreateSpacesMutation,
  useUpdateSpacesMutation,
  useDeleteSpacesMutation
} = spaceApi;
import { axiosClient } from './utils/axiosClient';

export const bookApi = {
  getBestsellers: () =>
    axiosClient.get('/book/bestseller'),

  getLatest: () =>
    axiosClient.get('/book/latest'),

  search: (query: string) =>
    axiosClient.get('/book/search', { params: { query } }),
};

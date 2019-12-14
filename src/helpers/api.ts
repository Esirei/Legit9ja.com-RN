import { AxiosResponse } from 'axios';

const TOTAL_COUNT = 'x-wp-total';
const TOTAL_PAGES = 'x-wp-totalpages';

export const totalPages = (response: AxiosResponse): number => {
  return Number(response.headers[TOTAL_PAGES] || 0);
};

export const totalItems = (response: AxiosResponse): number => {
  return Number(response.headers[TOTAL_COUNT] || 0);
};

export function data<T>(response: AxiosResponse<T>): T {
  return response.data;
}

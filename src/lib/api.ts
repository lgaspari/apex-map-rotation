import axios from 'axios';

export const fetcher = <T>(url: string) =>
  axios.get<T>(url).then(({ data }) => data);

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APEX_LEGENDS_API,

  /**
   * Move to `Authorization` header when available.
   *
   * @todo revisit.
   */
  params: {
    auth: import.meta.env.VITE_APEX_LEGENDS_API_SECRET_TOKEN,
  },
});

export default api;

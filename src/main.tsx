import api from 'lib/api';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import App from './App';
import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        /**
         * We wouldn't like to retry forever.
         *
         * @todo handle errors.
         */
        errorRetryCount: 5,

        /**
         * Default fetcher using Axios.
         */
        fetcher: (url: string) => api.get(url).then((res) => res.data),
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>
);

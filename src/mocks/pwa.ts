import { useState } from 'react';

export const mockUpdateServiceWorker = jest.fn();

export const mockUseRegisterSW = jest.fn(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_: {
    onRegisteredSW?: (url: string) => void;
    onRegisterError?: (err: { message: string }) => void;
  }) => {
    const [needRefresh, setNeedRefresh] = useState(true);

    return {
      needRefresh: [needRefresh, setNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    };
  }
);

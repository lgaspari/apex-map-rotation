import { useState } from 'react';
import { vi } from 'vitest';

export const updateServiceWorker = vi.fn();

export const useRegisterSW = vi.fn(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_: {
    onRegisteredSW?: (url: string) => void;
    onRegisterError?: (err: { message: string }) => void;
  }) => {
    const [needRefresh, setNeedRefresh] = useState(true);

    return {
      needRefresh: [needRefresh, setNeedRefresh],
      updateServiceWorker,
    };
  }
);

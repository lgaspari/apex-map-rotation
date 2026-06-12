import type { Dispatch, SetStateAction } from 'react';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { afterAll, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { updateServiceWorker, useRegisterSW } from 'mocks/pwa';
import PWAUpdatePrompt from './pwa-update-prompt';

const consoleErrorMock = vi.spyOn(console, 'error');
const consoleLogMock = vi.spyOn(console, 'log');

afterAll(() => {
  consoleErrorMock.mockReset();
  consoleLogMock.mockReset();
});

async function setup() {
  const screen = await render(<PWAUpdatePrompt />);

  return { screen };
}

test('can close prompt', async () => {
  const { screen } = await setup();

  await screen.getByRole('button', { name: 'Later' }).click();

  await waitForElementToBeRemoved(
    () =>
      screen
        .getByRole('dialog', {
          name: '✨ New version available',
        })
        .query(),
    { timeout: 2000 }
  );
});

test('can reload page', async () => {
  const { screen } = await setup();

  await expect
    .element(
      screen.getByRole('dialog', {
        name: '✨ New version available',
      })
    )
    .toBeInTheDocument();
  await expect
    .element(
      screen.getByText(
        'Please, click the reload button below to begin the update.'
      )
    )
    .toBeInTheDocument();

  await screen.getByRole('button', { name: 'Reload' }).click();

  expect(updateServiceWorker).toHaveBeenCalledWith(true);

  await waitForElementToBeRemoved(
    () =>
      screen
        .getByRole('dialog', {
          name: '✨ New version available',
        })
        .query(),
    { timeout: 2000 }
  );
});

test('should log message if succeeded to register service worker', async () => {
  consoleLogMock.mockImplementationOnce(() => vi.fn());

  const url = '/dev-sw.js?dev-sw';
  useRegisterSW.mockImplementationOnce(({ onRegisteredSW }) => {
    onRegisteredSW?.(url);

    return {
      needRefresh: [false, vi.fn()] as [
        boolean,
        Dispatch<SetStateAction<boolean>>,
      ],
      updateServiceWorker: vi.fn(),
    };
  });

  await setup();

  expect(consoleLogMock).toHaveBeenCalledWith('SW registered', url);
});

test('should log error message if failed to register service worker', async () => {
  consoleErrorMock.mockImplementationOnce(() => vi.fn());

  const error = { message: 'error' };
  useRegisterSW.mockImplementationOnce(({ onRegisterError }) => {
    onRegisterError?.(error);

    return {
      needRefresh: [false, vi.fn()] as [
        boolean,
        Dispatch<SetStateAction<boolean>>,
      ],
      updateServiceWorker: vi.fn(),
    };
  });

  await setup();

  expect(consoleErrorMock).toHaveBeenCalledWith('SW registration error', error);
});

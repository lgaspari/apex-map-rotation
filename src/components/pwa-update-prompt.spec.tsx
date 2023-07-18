import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockUpdateServiceWorker, mockUseRegisterSW } from 'mocks/pwa';
import PWAUpdatePrompt from './pwa-update-prompt';

jest.mock(
  'virtual:pwa-register/react',
  () => ({
    useRegisterSW: mockUseRegisterSW,
  }),
  { virtual: true }
);

function setup() {
  const user = userEvent.setup();

  const utils = render(<PWAUpdatePrompt />);

  return {
    ...utils,
    user,
  };
}

test('can close prompt', async () => {
  const { user } = setup();

  await user.click(screen.getByRole('button', { name: 'Later' }));

  await waitForElementToBeRemoved(() =>
    screen.queryByRole('dialog', {
      name: '✨ New version available',
    })
  );
});

test('can reload page', async () => {
  const { user } = setup();

  expect(
    screen.getByRole('dialog', {
      name: '✨ New version available',
    })
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Please, click the reload button below to begin the update.'
    )
  ).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Reload' }));

  expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);

  await waitForElementToBeRemoved(() =>
    screen.queryByRole('dialog', {
      name: '✨ New version available',
    })
  );
});

test('should log message if succeeded to register service worker', () => {
  jest.spyOn(console, 'log').mockImplementationOnce(() => jest.fn());

  const url = '/dev-sw.js?dev-sw';
  mockUseRegisterSW.mockImplementationOnce(({ onRegisteredSW }) => {
    onRegisteredSW?.(url);

    return {
      needRefresh: [false, jest.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    };
  });

  setup();

  expect(console.log).toHaveBeenCalledWith('SW registered', url);
});

test('should log message if failed to register service worker', () => {
  jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn());

  const error = { message: 'error' };
  mockUseRegisterSW.mockImplementationOnce(({ onRegisterError }) => {
    onRegisterError?.(error);

    return {
      needRefresh: [false, jest.fn()],
      updateServiceWorker: mockUpdateServiceWorker,
    };
  });

  setup();

  expect(console.error).toHaveBeenCalledWith('SW registration error', error);
});

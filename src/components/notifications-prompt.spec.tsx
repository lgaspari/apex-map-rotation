import { waitForElementToBeRemoved } from '@testing-library/react';
import { page, userEvent } from '@vitest/browser/context';
import { afterAll, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { MapCode } from 'constants/map';
import { Threshold } from 'constants/threshold';
import {
  isNotificationAPISupported,
  requestNotificationPermission,
  sendNotification,
  shouldPromptNotificationPermission,
} from 'lib/notifications';
import NotificationsPrompt, {
  type NotificationsPromptProps,
} from './notifications-prompt';

vi.mock('lib/notifications');

const consoleErrorMock = vi.spyOn(console, 'error');

afterAll(() => {
  consoleErrorMock.mockReset();
});

const defaultSettings: NotificationsPromptProps['notificationsSettings'] = {
  maps: Object.values(MapCode),
  prompt: true,
  threshold: Threshold.FIFTEEN_MINUTES,
};

function setup(props: Partial<NotificationsPromptProps> = {}) {
  const defaultProps: NotificationsPromptProps = {
    notificationsSettings: defaultSettings,
    setNotificationsSettings: vi.fn(),
  };

  const utils = render(<NotificationsPrompt {...defaultProps} {...props} />);

  const screen = page.elementLocator(utils.baseElement);

  return {
    ...utils,
    defaultProps,
    screen,
  };
}

describe('Supported', () => {
  test('should not prompt notification permission if supported and granted or denied', () => {
    vi.mocked(isNotificationAPISupported).mockReturnValue(true);
    vi.mocked(shouldPromptNotificationPermission).mockReturnValue(false);

    const { screen } = setup();

    expect(
      screen
        .getByRole('dialog', {
          name: '🔕 Disabled map notifications',
        })
        .query()
    ).not.toBeInTheDocument();
    expect(
      screen
        .getByRole('dialog', {
          name: "🔔 Hey, don't miss your favorite map!",
        })
        .query()
    ).not.toBeInTheDocument();
  });

  test('should not prompt notification permission if setting is false', () => {
    vi.mocked(isNotificationAPISupported).mockReturnValue(true);
    vi.mocked(shouldPromptNotificationPermission).mockReturnValue(true);

    const { screen } = setup({
      notificationsSettings: {
        ...defaultSettings,
        prompt: false,
      },
    });

    expect(
      screen
        .getByRole('dialog', {
          name: '🔕 Disabled map notifications',
        })
        .query()
    ).not.toBeInTheDocument();
    expect(
      screen
        .getByRole('dialog', {
          name: "🔔 Hey, don't miss your favorite map!",
        })
        .query()
    ).not.toBeInTheDocument();
  });

  test('can prevent from showing prompt again', async () => {
    vi.mocked(isNotificationAPISupported).mockReturnValue(true);
    vi.mocked(shouldPromptNotificationPermission).mockReturnValue(true);

    const { defaultProps, screen } = setup();

    await userEvent.click(
      screen.getByRole('button', { name: "Don't show again" })
    );

    expect(defaultProps.setNotificationsSettings).toHaveBeenCalledWith({
      prompt: false,
    });

    await waitForElementToBeRemoved(
      () =>
        screen
          .getByRole('dialog', {
            name: "🔔 Hey, don't miss your favorite map!",
          })
          .query(),
      { timeout: 2000 }
    );
  });

  test('should prompt notification permission if supported and permission is default', async () => {
    vi.mocked(isNotificationAPISupported).mockReturnValue(true);
    vi.mocked(shouldPromptNotificationPermission).mockReturnValue(true);

    const { screen } = setup({
      notificationsSettings: {
        ...defaultSettings,
        prompt: undefined, // should work the same as `true`
      },
    });

    await expect
      .element(
        screen.getByRole('dialog', {
          name: "🔔 Hey, don't miss your favorite map!",
        })
      )
      .toBeInTheDocument();
    await expect
      .element(
        screen.getByText(
          'Would you like to receive map change notifications from us?'
        )
      )
      .toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Not now' }));

    await waitForElementToBeRemoved(
      () =>
        screen
          .getByRole('dialog', {
            name: "🔔 Hey, don't miss your favorite map!",
          })
          .query(),
      { timeout: 2000 }
    );
  });

  test('should request notification permission if user consents', async () => {
    vi.mocked(isNotificationAPISupported).mockReturnValue(true);
    vi.mocked(requestNotificationPermission).mockResolvedValueOnce('default');
    vi.mocked(shouldPromptNotificationPermission).mockReturnValue(true);

    const { defaultProps, screen } = setup();

    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(requestNotificationPermission).toHaveBeenCalled();
    expect(defaultProps.setNotificationsSettings).toHaveBeenCalledWith({
      prompt: false,
    });

    await waitForElementToBeRemoved(
      () =>
        screen
          .getByRole('dialog', {
            name: "🔔 Hey, don't miss your favorite map!",
          })
          .query(),
      { timeout: 2000 }
    );
  });

  test('should not request notification permission if user consents but there is an unexpected error', async () => {
    consoleErrorMock.mockImplementationOnce(() => vi.fn());
    const error = 'Unexpected error';

    vi.mocked(isNotificationAPISupported).mockReturnValue(true);
    vi.mocked(requestNotificationPermission).mockImplementationOnce(() => {
      throw new Error(error);
    });
    vi.mocked(shouldPromptNotificationPermission).mockReturnValue(true);

    const { defaultProps, screen } = setup();

    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(requestNotificationPermission).toHaveBeenCalled();
    expect(defaultProps.setNotificationsSettings).not.toHaveBeenCalled();

    await waitForElementToBeRemoved(
      () =>
        screen
          .getByRole('dialog', {
            name: "🔔 Hey, don't miss your favorite map!",
          })
          .query(),
      { timeout: 2000 }
    );

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'An unexpected error occurred while requesting notification permission',
      new Error(error)
    );
  });

  test('should send dummy notification if user grants permission', async () => {
    vi.mocked(isNotificationAPISupported).mockReturnValue(true);
    vi.mocked(requestNotificationPermission).mockResolvedValueOnce('granted');
    vi.mocked(shouldPromptNotificationPermission).mockReturnValue(true);

    const { defaultProps, screen } = setup();

    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(defaultProps.setNotificationsSettings).toHaveBeenCalledWith({
      prompt: false,
    });

    await waitForElementToBeRemoved(
      () =>
        screen
          .getByRole('dialog', {
            name: "🔔 Hey, don't miss your favorite map!",
          })
          .query(),
      { timeout: 2000 }
    );

    expect(sendNotification).toHaveBeenCalledWith({
      title: 'Notifications enabled',
    });
  });
});

describe('Not Supported', () => {
  test('should announce disabled notifications if not supported', async () => {
    vi.mocked(isNotificationAPISupported).mockReturnValue(false);

    const { screen } = setup();

    await expect
      .element(
        screen.getByRole('dialog', {
          name: '🔕 Disabled map notifications',
        })
      )
      .toBeInTheDocument();
    await expect
      .element(
        screen.getByText(
          "Looks like notifications aren't supported in your browser, sorry!"
        )
      )
      .toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Understood' }));

    await waitForElementToBeRemoved(
      () =>
        screen
          .getByRole('dialog', {
            name: '🔕 Disabled map notifications',
          })
          .query(),
      { timeout: 2000 }
    );
  });

  test('can prevent from showing prompt again', async () => {
    vi.mocked(isNotificationAPISupported).mockReturnValue(false);

    const { defaultProps, screen } = setup();

    await userEvent.click(
      screen.getByRole('button', { name: "Don't show again" })
    );

    expect(defaultProps.setNotificationsSettings).toHaveBeenCalledWith({
      prompt: false,
    });

    await waitForElementToBeRemoved(
      () =>
        screen
          .getByRole('dialog', {
            name: '🔕 Disabled map notifications',
          })
          .query(),
      { timeout: 2000 }
    );
  });
});

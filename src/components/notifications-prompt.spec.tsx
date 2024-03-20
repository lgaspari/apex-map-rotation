import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

jest.mock('lib/notifications');

const defaultSettings: NotificationsPromptProps['notificationsSettings'] = {
  maps: Object.values(MapCode),
  prompt: true,
  threshold: Threshold.FIFTEEN_MINUTES,
};

function setup(props: Partial<NotificationsPromptProps> = {}) {
  const defaultProps: NotificationsPromptProps = {
    notificationsSettings: defaultSettings,
    setNotificationsSettings: jest.fn(),
  };

  const user = userEvent.setup();

  const utils = render(<NotificationsPrompt {...defaultProps} {...props} />);

  return {
    ...utils,
    defaultProps,
    user,
  };
}

describe('Supported', () => {
  test('should not prompt notification permission if supported and granted or denied', async () => {
    (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
    (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(false);

    setup();

    expect(
      screen.queryByRole('dialog', {
        name: '🔕 Disabled map notifications',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', {
        name: "🔔 Hey, don't miss your favorite map!",
      })
    ).not.toBeInTheDocument();
  });

  test('should not prompt notification permission if setting is false', async () => {
    (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
    (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(true);

    setup({
      notificationsSettings: {
        ...defaultSettings,
        prompt: false,
      },
    });

    expect(
      screen.queryByRole('dialog', {
        name: '🔕 Disabled map notifications',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', {
        name: "🔔 Hey, don't miss your favorite map!",
      })
    ).not.toBeInTheDocument();
  });

  test('can prevent from showing prompt again', async () => {
    (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
    (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(true);

    const { defaultProps, user } = setup();

    await user.click(screen.getByRole('button', { name: "Don't show again" }));

    expect(defaultProps.setNotificationsSettings).toHaveBeenCalledWith({
      prompt: false,
    });

    await waitForElementToBeRemoved(
      () =>
        screen.queryByRole('dialog', {
          name: "🔔 Hey, don't miss your favorite map!",
        }),
      { timeout: 2000 }
    );
  });

  test('should prompt notification permission if supported and permission is default', async () => {
    (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
    (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(true);

    const { user } = setup({
      notificationsSettings: {
        ...defaultSettings,
        prompt: undefined, // should work the same as `true`
      },
    });

    expect(
      screen.getByRole('dialog', {
        name: "🔔 Hey, don't miss your favorite map!",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Would you like to receive map change notifications from us?'
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Not now' }));

    await waitForElementToBeRemoved(
      () =>
        screen.queryByRole('dialog', {
          name: "🔔 Hey, don't miss your favorite map!",
        }),
      { timeout: 2000 }
    );
  });

  test('should request notification permission if user consents', async () => {
    (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
    (requestNotificationPermission as jest.Mock).mockResolvedValueOnce(
      'default'
    );
    (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(true);

    const { defaultProps, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    expect(requestNotificationPermission).toHaveBeenCalled();
    expect(defaultProps.setNotificationsSettings).toHaveBeenCalledWith({
      prompt: false,
    });

    await waitForElementToBeRemoved(
      () =>
        screen.queryByRole('dialog', {
          name: "🔔 Hey, don't miss your favorite map!",
        }),
      { timeout: 2000 }
    );
  });

  test('should send dummy notification if user grants permission', async () => {
    (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
    (requestNotificationPermission as jest.Mock).mockResolvedValueOnce(
      'granted'
    );
    (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(true);

    const { defaultProps, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    expect(defaultProps.setNotificationsSettings).toHaveBeenCalledWith({
      prompt: false,
    });

    await waitForElementToBeRemoved(
      () =>
        screen.queryByRole('dialog', {
          name: "🔔 Hey, don't miss your favorite map!",
        }),
      { timeout: 2000 }
    );

    expect(sendNotification).toHaveBeenCalledWith({
      title: 'Notifications enabled',
    });
  });
});

describe('Not Supported', () => {
  test('should announce disabled notifications if not supported', async () => {
    (isNotificationAPISupported as jest.Mock).mockReturnValue(false);

    const { user } = setup();

    expect(
      screen.getByRole('dialog', {
        name: '🔕 Disabled map notifications',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Looks like notifications aren't supported in your browser, sorry!"
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Understood' }));

    await waitForElementToBeRemoved(
      () =>
        screen.queryByRole('dialog', {
          name: '🔕 Disabled map notifications',
        }),
      { timeout: 2000 }
    );
  });

  test('can prevent from showing prompt again', async () => {
    (isNotificationAPISupported as jest.Mock).mockReturnValue(false);

    const { defaultProps, user } = setup();

    await user.click(screen.getByRole('button', { name: "Don't show again" }));

    expect(defaultProps.setNotificationsSettings).toHaveBeenCalledWith({
      prompt: false,
    });

    await waitForElementToBeRemoved(
      () =>
        screen.queryByRole('dialog', {
          name: '🔕 Disabled map notifications',
        }),
      { timeout: 2000 }
    );
  });
});

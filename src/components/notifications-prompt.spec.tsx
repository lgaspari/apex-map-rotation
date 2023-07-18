import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  isNotificationAPISupported,
  requestNotificationPermission,
  sendNotification,
  shouldPromptNotificationPermission,
} from 'lib/notifications';
import NotificationsPrompt from './notifications-prompt';

jest.mock('lib/notifications');

function setup() {
  const user = userEvent.setup();

  const utils = render(<NotificationsPrompt />);

  return {
    ...utils,
    user,
  };
}

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

test('should prompt notification permission if supported and permission is default', async () => {
  (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
  (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(true);

  const { user } = setup();

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

  await waitForElementToBeRemoved(() =>
    screen.queryByRole('dialog', {
      name: "🔔 Hey, don't miss your favorite map!",
    })
  );
});

test('should request notification permission if user consents', async () => {
  (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
  (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(true);
  (requestNotificationPermission as jest.Mock).mockResolvedValueOnce('default');

  const { user } = setup();

  await user.click(screen.getByRole('button', { name: 'Yes' }));

  await waitForElementToBeRemoved(() =>
    screen.queryByRole('dialog', {
      name: "🔔 Hey, don't miss your favorite map!",
    })
  );

  expect(requestNotificationPermission).toHaveBeenCalled();
});

test('should send dummy notification if user grants permission', async () => {
  (isNotificationAPISupported as jest.Mock).mockReturnValue(true);
  (shouldPromptNotificationPermission as jest.Mock).mockReturnValue(true);
  (requestNotificationPermission as jest.Mock).mockResolvedValueOnce('granted');

  const { user } = setup();

  await user.click(screen.getByRole('button', { name: 'Yes' }));

  await waitForElementToBeRemoved(() =>
    screen.queryByRole('dialog', {
      name: "🔔 Hey, don't miss your favorite map!",
    })
  );

  expect(sendNotification).toHaveBeenCalledWith({
    title: 'Notifications enabled',
  });
});

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

  await waitForElementToBeRemoved(() =>
    screen.queryByRole('dialog', {
      name: '🔕 Disabled map notifications',
    })
  );
});

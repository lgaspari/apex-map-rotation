import Dialog from 'components/dialog';
import {
  isNotificationAPISupported,
  requestNotificationPermission,
  sendNotification,
  shouldPromptNotificationPermission,
} from 'lib/notifications';
import { useEffect, useState } from 'react';
import type Settings from 'types/settings';

export interface NotificationsPromptProps {
  notificationsSettings: Settings['notifications'];
  setNotificationsSettings: (
    partialNotifications: Partial<Settings['notifications']>
  ) => void;
}

export default function NotificationsPrompt({
  notificationsSettings,
  setNotificationsSettings,
}: NotificationsPromptProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(notificationsSettings.prompt ?? true);
  }, [notificationsSettings.prompt]);

  const handleClose = () => setMounted(false);

  const handleDoNotShowAgain = () => {
    setNotificationsSettings({ prompt: false });
    handleClose();
  };

  const handleGrant = () => {
    try {
      requestNotificationPermission().then((permission) => {
        if (permission === 'granted') {
          sendNotification({ title: 'Notifications enabled' });
        }

        setNotificationsSettings({ prompt: false });
      });
    } catch (err) {
      /**
       * @todo handle errors
       */
      console.error(
        'An unexpected error occurred while requesting notification permission',
        err
      );
    } finally {
      handleClose();
    }
  };

  const doNotShowAgainButton = (
    <Dialog.OptionalButton onClick={handleDoNotShowAgain}>
      Don't show again
    </Dialog.OptionalButton>
  );

  return (
    <>
      {isNotificationAPISupported() ? (
        shouldPromptNotificationPermission() && (
          <Dialog
            onClose={handleClose}
            opened={mounted}
            title="🔔 Hey, don't miss your favorite map!"
          >
            <Dialog.Content>
              Would you like to receive map change notifications from us?
            </Dialog.Content>

            <Dialog.Actions>
              <Dialog.ConfirmButton onClick={handleGrant}>
                Yes
              </Dialog.ConfirmButton>

              <Dialog.CancelButton onClick={handleClose}>
                Not now
              </Dialog.CancelButton>

              {doNotShowAgainButton}
            </Dialog.Actions>
          </Dialog>
        )
      ) : (
        <Dialog
          onClose={handleClose}
          opened={mounted}
          title="🔕 Disabled map notifications"
        >
          <Dialog.Content>
            Looks like notifications aren't supported in your browser, sorry!
          </Dialog.Content>

          <Dialog.Actions>
            <Dialog.ConfirmButton onClick={handleClose}>
              Understood
            </Dialog.ConfirmButton>

            {doNotShowAgainButton}
          </Dialog.Actions>
        </Dialog>
      )}
    </>
  );
}

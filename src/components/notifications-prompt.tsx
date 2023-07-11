import Dialog from 'components/dialog';
import {
  isNotificationAPISupported,
  requestNotificationPermission,
  sendNotification,
  shouldPromptNotificationPermission,
} from 'lib/notifications';
import { useEffect, useState } from 'react';

export default function NotificationsPrompt() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => setMounted(false);

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
              <Dialog.ConfirmButton
                onClick={() => {
                  /**
                   * No need for async-await at the moment.
                   *
                   * @todo handle errors
                   */
                  requestNotificationPermission().then((permission) => {
                    if (permission === 'granted') {
                      sendNotification({ title: 'Notifications enabled' });
                    }
                  });
                  handleClose();
                }}
              >
                Yes
              </Dialog.ConfirmButton>
              <Dialog.CancelButton onClick={handleClose}>
                Not now
              </Dialog.CancelButton>
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
          </Dialog.Actions>
        </Dialog>
      )}
    </>
  );
}

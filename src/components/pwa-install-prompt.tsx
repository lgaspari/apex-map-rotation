import Dialog from 'components/dialog';
import { useEffect, useRef, useState } from 'react';

/**
 * Window event called `beforeinstallprompt` is experimental and shouldn't be
 * used in production sites as it may not work and its behavior may change in
 * the future.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
 */
export default function PWAInstallPrompt() {
  const [opened, setOpened] = useState(false);

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // --------------------------------------------------------------------------

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later.
      deferredPromptRef.current = e as BeforeInstallPromptEvent;

      // Update UI notify the user they can install the PWA
      setOpened(true);

      // Optionally, send analytics event that PWA install promo was shown.
      console.log(`[PWA] 'beforeinstallprompt' event was fired.`);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // --------------------------------------------------------------------------

  const handleClose = () => setOpened(false);

  const handleInstall = async () => {
    if (deferredPromptRef.current) {
      // Show the install prompt
      deferredPromptRef.current.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPromptRef.current.userChoice;

      // Optionally, send analytics event with outcome of user choice
      console.log(`[PWA] User response to the install prompt: ${outcome}`);

      // We've used the prompt, and can't use it again, throw it away
      deferredPromptRef.current = null;
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      opened={opened}
      title="🚀 Install 'Apex Legends - Map Rotation'"
    >
      <Dialog.Content>
        Install our web application on your home screen for a better experience.
      </Dialog.Content>

      <Dialog.Actions>
        <Dialog.ConfirmButton
          onClick={() => {
            handleInstall();
            handleClose();
          }}
        >
          Install
        </Dialog.ConfirmButton>
        <Dialog.CancelButton onClick={handleClose}>Later</Dialog.CancelButton>
      </Dialog.Actions>
    </Dialog>
  );
}

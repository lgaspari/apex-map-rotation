import Dialog from 'components/dialog';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(url) {
      console.log('SW registered', url);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const handleClose = () => setNeedRefresh(false);

  return (
    <Dialog
      onClose={handleClose}
      opened={needRefresh}
      title="✨ New version available"
    >
      <Dialog.Content>
        Please, click the reload button below to begin the update.
      </Dialog.Content>

      <Dialog.Actions>
        <Dialog.ConfirmButton
          onClick={() => {
            updateServiceWorker(true);
            handleClose();
          }}
        >
          Reload
        </Dialog.ConfirmButton>
        <Dialog.CancelButton onClick={handleClose}>Later</Dialog.CancelButton>
      </Dialog.Actions>
    </Dialog>
  );
}

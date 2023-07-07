import Dialog from 'components/dialog';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
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

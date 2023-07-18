import { CloseIcon } from 'icons';
import { useEffect, useState } from 'react';

export interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
  opened: boolean;
  title: string;
}

export default function Dialog({
  children,
  onClose,
  opened,
  title,
}: DialogProps) {
  return (
    <Dialog.Transition mounted={opened}>
      <div
        /**
         * We should use `aria-labelledby` instead of `aria-label` when there's
         * a descriptive element with the same display value (modal title).
         *
         * However, doing so requires us to generate random unique identifiers
         * to differentiate each dialog title in the screen.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role
         */
        aria-label={title}
        /**
         * Temporarily adding a max width so overlapping dialogs are shown one
         * below the other.
         *
         * @todo remove `max-w-sm` class in favor of a better mechanism.
         */
        className="max-w-sm p-4 rounded-md bg-[#121212] border-2 border-apex border-solid shadow-md shadow-black"
        role="dialog"
      >
        <div className="flex flex-row items-center justify-between gap-2 mb-2 text-white">
          <div className="text-base font-semibold">{title}</div>
          <button className="rounded-sm" onClick={onClose} title="Close">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </Dialog.Transition>
  );
}

Dialog.Actions = function DialogActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex gap-2 mt-6">{children}</div>;
};

Dialog.CancelButton = function CancelButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="px-4 py-1 rounded-md text-base text-black font-normal bg-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Dialog.ConfirmButton = function ConfirmButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="px-4 py-1 rounded-md text-base text-white font-normal bg-apex focus:outline-apex"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Dialog.Content = function DialogContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="text-gray-200 text-sm">{children}</div>;
};

Dialog.Transition = function DialogTransition({
  children,
  mounted,
}: {
  children: React.ReactNode;
  mounted: boolean;
}) {
  const [internalMounted, setInternalMounted] = useState(false);
  const [internalTransition, setInternalTransition] = useState(false);

  useEffect(() => {
    if (mounted) {
      setInternalMounted(mounted);
      setTimeout(() => {
        setInternalTransition(mounted);
      });
    } else {
      if (internalMounted) {
        setInternalTransition(mounted);
        setTimeout(() => {
          setInternalMounted(mounted);
        }, 1000);
      }
    }
    // We cannot use `internalMounted` as dependency, otherwise it will be a
    // cyclic side effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return (
    <div
      // Adding `p-4` here to prevent dialog from touching the screen borders.
      className={`z-10 fixed bottom-0 right-0 p-4 ${
        internalTransition ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-[1000ms]`}
    >
      {internalMounted && children}
    </div>
  );
};

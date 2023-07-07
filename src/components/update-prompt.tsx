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

  return (
    <div
      className={`z-10 fixed bottom-0 right-0 p-4 ${
        needRefresh ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-1000`}
    >
      <div className="p-4 flex flex-col gap-6 rounded-md bg-[#121212] border-2 border-apex border-solid shadow-md shadow-black">
        <div className="flex flex-col gap-2">
          <div className="text-white text-base font-semibold">
            ✨ New update available
          </div>
          <div className="text-gray-200 text-sm">
            Please, click the reload button below to begin the update.
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="px-6 sm:px-8 py-2 rounded-md text-base text-white font-normal bg-apex focus:outline-apex"
            onClick={() => {
              updateServiceWorker(true);
              setNeedRefresh(true);
            }}
          >
            Reload
          </button>
          <button
            className="px-6 sm:px-8 py-2 rounded-md text-base text-black font-normal bg-white"
            onClick={() => setNeedRefresh(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

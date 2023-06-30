import { MapName } from 'constants/map';
import { useEffect, useState } from 'react';
import type Settings from 'types/settings';

export interface SettingsModalProps {
  onClose: () => void;
  opened: boolean;
  setSettings: (settings: Settings) => void;
  settings: Settings;
}

export default function SettingsModal({
  onClose,
  opened,
  settings,
  setSettings,
}: SettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [draftSettings, setDraftSettings] = useState(settings);

  useEffect(() => {
    setMounted(opened);
  }, [opened]);

  useEffect(() => {
    if (opened) {
      setDraftSettings(settings);
    }
  }, [opened, settings]);

  const handleMapClick = (code: string, checked: boolean) => {
    setDraftSettings(
      ({ notifications: { maps, ...notifications }, ...draftSettings }) => ({
        ...draftSettings,
        notifications: {
          ...notifications,
          maps: checked ? [...maps, code] : maps.filter((map) => map !== code),
        },
      })
    );
  };

  const handleSave = () => {
    setSettings(draftSettings);
    onClose();
  };

  const { maps, threshold } = draftSettings.notifications;

  return (
    <div
      className={`z-20 fixed top-0 left-0 h-screen w-screen p-4 bg-black bg-opacity-80 ${
        opened ? 'flex flex-col items-center justify-center' : 'hidden'
      }`}
      data-testid="settings-modal-overlay"
    >
      <div
        className={`max-w-md w-[100%] rounded-md bg-[#121212] border-2 border-apex border-solid shadow-lg shadow-black ${
          mounted ? 'scale-100' : 'scale-50'
        } transition-transform duration-500`}
      >
        <div className="p-6 text-3xl text-white font-bold">Settings</div>

        <div className="px-6 py-6 text-gray-200 border-y border-gray-800 border-solid">
          <div
            className="text-base font-light"
            data-testid="notification-threshold"
          >
            Notify me <span className="font-semibold">{threshold} minutes</span>{' '}
            before the following maps:
          </div>

          <div className="mt-4 px-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(MapName).map(([code, name]) => (
              <label
                className="w-fit flex items-center gap-2 hover:cursor-pointer"
                htmlFor={code}
                key={code}
              >
                <input
                  checked={maps.includes(code)}
                  className="h-4 w-4 appearance-none rounded-sm bg-white checked:bg-apex border border-solid border-gray-200"
                  id={code}
                  onChange={(e) => handleMapClick(code, e.target.checked)}
                  type="checkbox"
                />
                <span className="text-white text-base font-extralight">
                  {name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 flex justify-end gap-2">
          <button
            className="px-8 py-2 rounded-md text-base text-black font-normal bg-white"
            onClick={onClose}
          >
            Discard
          </button>
          <button
            className="px-8 py-2 rounded-md text-base text-white font-normal bg-apex focus:outline-apex"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

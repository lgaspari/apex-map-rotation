import { MapName, type MapCode } from 'constants/map';
import { ThresholdLabel } from 'constants/threshold';
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

  const handleMapChange = (code: MapCode, checked: boolean) => {
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

  const handleThresholdChange = (threshold: number) => {
    setDraftSettings(({ notifications, ...draftSettings }) => ({
      ...draftSettings,
      notifications: {
        ...notifications,
        threshold,
      },
    }));
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
        className={`max-h-full overflow-y-auto max-w-md w-[100%] rounded-md bg-[#161616] border-2 border-apex border-solid shadow-lg shadow-black ${
          mounted ? 'scale-100' : 'scale-50'
        } transition-transform duration-500`}
      >
        <h2 className="p-6 text-2xl text-white font-tt-lakes-w05-medium">
          Notifications
        </h2>

        <div className="p-6 font-tt-lakes-w05-regular text-gray-200 border-y border-gray-800 border-solid">
          {/* Threshold */}
          <div className="mb-2 flex flex-row items-center gap-2">
            <div className="font-tt-lakes-w05-medium">Threshold:</div>
            <select
              className="appearance-none text-center bg-transparent border-b-2 border-b-apex font-tt-lakes-w05-light"
              name="threshold"
              onChange={(e) => handleThresholdChange(Number(e.target.value))}
              value={threshold}
            >
              {Object.entries(ThresholdLabel).map(([threshold, label]) => (
                <option key={threshold} value={threshold}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Maps */}
          <div>
            <div className="font-tt-lakes-w05-medium">Maps:</div>
            <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.entries(MapName) as Array<[MapCode, string]>).map(
                ([code, name]) => (
                  <label
                    className="w-fit flex items-center gap-2 hover:cursor-pointer"
                    htmlFor={code}
                    key={code}
                  >
                    <input
                      checked={maps.includes(code)}
                      className="h-4 w-4 appearance-none rounded-sm bg-white checked:bg-apex border border-solid border-gray-200"
                      id={code}
                      name="maps"
                      onChange={(e) => handleMapChange(code, e.target.checked)}
                      type="checkbox"
                    />
                    <span className="text-white text-base font-tt-lakes-w05-light">
                      {name}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-end gap-2">
          <button
            className="px-6 sm:px-8 py-2 rounded-md text-base text-black font-tt-lakes-w05-regular font-normal bg-white"
            onClick={onClose}
          >
            Discard
          </button>
          <button
            className="px-6 sm:px-8 py-2 rounded-md text-base text-white font-tt-lakes-w05-regular font-normal bg-apex focus:outline-apex"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

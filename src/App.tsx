import SettingsModal from 'components/settings-modal';
import { MapCode } from 'constants/map';
import useLocalStorage from 'hooks/use-local-storage';
import usePromptNotificationPermission from 'hooks/use-prompt-notification-permission';
import { SettingsIcon } from 'icons';
import MapRotationPage from 'pages/map-rotation';
import { useState } from 'react';
import type Settings from 'types/settings';

export default function App() {
  const [openedSettingsModal, setOpenedSettingsModal] = useState(false);

  const [settings, setSettings] = useLocalStorage<Settings>(
    'apex-legends-settings',
    {
      notifications: {
        maps: Object.values(MapCode),
        threshold: 15,
      },
    }
  );

  usePromptNotificationPermission();

  return (
    <div>
      {/* Header */}
      <div className="fixed z-10 top-0 left-0 right-0 h-12 p-2 flex justify-between items-center bg-apex drop-shadow-lg">
        <div className="w-16 flex items-center justify-start">
          <img
            alt="Apex Legends Logo"
            height={32}
            src={import.meta.env.VITE_APEX_LEGENDS_LOGO_URL}
            width={48}
          />
        </div>

        <div className="text-white text-lg font-bold uppercase">
          Map Rotation
        </div>

        <div className="w-16 flex items-center justify-end">
          <button
            className="rounded-sm text-white"
            onClick={() => setOpenedSettingsModal(true)}
          >
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* Content */}
      <MapRotationPage settings={settings} />

      {/* Settings */}
      <SettingsModal
        onClose={() => setOpenedSettingsModal(false)}
        opened={openedSettingsModal}
        setSettings={setSettings}
        settings={settings}
      />
    </div>
  );
}

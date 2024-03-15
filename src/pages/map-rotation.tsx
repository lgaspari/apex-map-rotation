import ApexPredatorLogo from 'assets/apex-predator-logo.webp';
import Map from 'components/map';
import Spinner from 'components/spinner';
import useScheduledMapNotification from 'hooks/use-scheduled-map-notification';
import { getMapRotationPerMode } from 'lib/api';
import { getDiffToNow } from 'lib/datetime';
import { useState } from 'react';
import useSWR from 'swr';
import type MapType from 'types/map';
import type { MapRotationPerMode } from 'types/map-rotation';
import type Settings from 'types/settings';

const GameMode: Record<string, keyof MapRotationPerMode> = {
  Pubs: 'pubs',
  Ranked: 'ranked',
};

interface MapRotationPageProps {
  settings: Settings;
}

export default function MapRotationPage({ settings }: MapRotationPageProps) {
  const [gameMode, setGameMode] = useState<keyof MapRotationPerMode>(
    GameMode.Pubs
  );

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<MapRotationPerMode>(
      import.meta.env.VITE_APEX_LEGENDS_API_MAP_ROTATION_ENDPOINT,
      {
        /**
         * We prefer manual retry over automatic retry. SWR will retry (revalidate)
         * the data on focus if `revalidateOnFocus` is enabled.
         */
        errorRetryCount: 0,

        /**
         * Use custom fetcher to parse api data.
         */
        fetcher: getMapRotationPerMode,

        /**
         * Refresh data when the current map finishes.
         *
         * There's a known issue with the Apex Legends API that returns invalid
         * data if requested in the exact same instant as the map changes.
         *
         * Therefore, instead of sending the request right on time, we delay it
         * for a second.
         */
        refreshInterval: (data) =>
          data ? getDiffToNow(data[gameMode].current.end) + 1000 : 0,

        /**
         * Enable refresh when window is not visible.
         */
        refreshWhenHidden: true,
      }
    );

  const isRankedGameMode = gameMode === GameMode.Ranked;

  return (
    <>
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Spinner />
        </div>
      ) : !data || error ? (
        <div className="p-8 flex-grow flex flex-col items-center justify-center gap-4">
          <div className="text-black text-base text-center font-light">
            An unexpected error occurred while loading the map rotation
          </div>
          <button
            className="px-8 py-2 rounded-md text-base text-white font-normal bg-apex focus:outline-apex"
            onClick={() => mutate(undefined)}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="relative flex-grow flex flex-col">
          <MapRotationView
            current={data[gameMode].current}
            isRankedGameMode={isRankedGameMode}
            next={data[gameMode].next}
            settings={settings}
          />

          {isValidating && (
            <div className="absolute top-0 right-0 p-2">
              <Spinner size="small" />
            </div>
          )}

          <button
            // Added class `mt-6` to compensate half the header size (class `h-12`).
            className={`mt-6 fixed top-[50%] translate-y-[-50%] w-[72px] right-0 border-2 border-r-0 border-[#17435c] ${
              isRankedGameMode ? 'bg-[#0b1b24]' : 'bg-neutral-200'
            } p-2 rounded-s-lg flex flex-col items-center gap-1`}
            onClick={() =>
              setGameMode(isRankedGameMode ? GameMode.Pubs : GameMode.Ranked)
            }
          >
            <img
              alt=""
              {...(!isRankedGameMode ? { className: 'grayscale' } : {})}
              src={ApexPredatorLogo}
              width={48}
            />
            <span
              className={`uppercase font-bold text-xs ${
                isRankedGameMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              {isRankedGameMode ? GameMode.Ranked : GameMode.Pubs}
            </span>
          </button>
        </div>
      )}
    </>
  );
}

interface MapRotationViewProps {
  current: MapType;
  isRankedGameMode: boolean;
  next: MapType;
  settings: Settings;
}

function MapRotationView({
  current,
  isRankedGameMode,
  next,
  settings,
}: MapRotationViewProps) {
  useScheduledMapNotification({
    enabled: settings.notifications.maps.includes(next.code),
    map: next,
    threshold: settings.notifications.threshold,
  });

  return (
    <div className="flex-grow grid grid-rows-2">
      <Map current isRankedGameMode={isRankedGameMode} map={current} />
      <Map isRankedGameMode={isRankedGameMode} map={next} />
    </div>
  );
}

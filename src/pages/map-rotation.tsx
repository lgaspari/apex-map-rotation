import Map from 'components/map';
import Spinner from 'components/spinner';
import useScheduledMapNotification from 'hooks/use-scheduled-map-notification';
import { getMapRotationPerMode } from 'lib/api';
import { getDiffToNow } from 'lib/datetime';
import useSWR from 'swr';
import type MapType from 'types/map';
import type { MapRotationPerMode } from 'types/map-rotation';
import type Settings from 'types/settings';

interface MapRotationPageProps {
  settings: Settings;
}

export default function MapRotationPage({ settings }: MapRotationPageProps) {
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
          data ? getDiffToNow(data.pubs.current.end) + 1000 : 0,

        /**
         * Enable refresh when window is not visible.
         */
        refreshWhenHidden: true,
      }
    );

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
            current={data.pubs.current}
            next={data.pubs.next}
            settings={settings}
          />

          {isValidating && (
            <div className="absolute top-0 right-0 p-2">
              <Spinner size="small" />
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface MapRotationViewProps {
  current: MapType;
  next: MapType;
  settings: Settings;
}

function MapRotationView({ current, next, settings }: MapRotationViewProps) {
  useScheduledMapNotification({
    enabled: settings.notifications.maps.includes(next.code),
    map: next,
    threshold: settings.notifications.threshold,
  });

  return (
    <div className="flex-grow grid grid-rows-2">
      <Map current map={current} />
      <Map map={next} />
    </div>
  );
}

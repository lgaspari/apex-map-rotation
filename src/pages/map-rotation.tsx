import Map from 'components/map';
import Spinner from 'components/spinner';
import useScheduledMapNotification from 'hooks/use-scheduled-map-notification';
import { getMapRotation } from 'lib/api';
import { getDate, getDiff } from 'lib/datetime';
import useSWR from 'swr';
import type MapType from 'types/map';

export default function MapRotationPage() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<{
    current: MapType;
    next: MapType;
  }>(import.meta.env.VITE_APEX_LEGENDS_API_MAP_ROTATION_ENDPOINT, {
    /**
     * We prefer manual retry over automatic retry. SWR will retry (revalidate)
     * the data on focus if `revalidateOnFocus` is enabled.
     */
    errorRetryCount: 0,

    /**
     * Use custom fetcher to parse api data.
     */
    fetcher: getMapRotation,

    /**
     * Refresh when the current map finishes.
     */
    refreshInterval: (data) =>
      data ? getDiff(getDate(), data.current.end) : 0,

    /**
     * Enable refresh when window is not visible.
     */
    refreshWhenHidden: true,
  });

  return (
    <div className="min-h-screen pt-12 flex flex-col">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <div className="text-black text-base font-light">
            An unexpected error occurred while loading the map rotation
          </div>
          <button
            className="px-8 py-2 rounded-md text-white text-sm font-normal uppercase bg-apex"
            onClick={() => mutate(undefined)}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="relative flex-grow flex flex-col">
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          <MapRotationView current={data!.current} next={data!.next} />

          {isValidating && (
            <div className="absolute top-0 right-0 p-2">
              <Spinner size="small" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MapRotationView({
  current,
  next,
}: {
  current: MapType;
  next: MapType;
}) {
  useScheduledMapNotification({ map: next });

  return (
    <div className="flex-grow grid grid-rows-2">
      <Map current map={current} />
      <Map map={next} />
    </div>
  );
}

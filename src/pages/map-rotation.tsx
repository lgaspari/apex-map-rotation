import Spinner from 'components/spinner';
import TimeRemaining from 'components/time-remaining';
import useScheduledMapNotification from 'hooks/use-scheduled-map-notification';
import { format, getDate, getDateFromUnix, getDiff } from 'lib/datetime';
import useSWR from 'swr';
import MapRotationType from 'types/map-rotation';

export default function MapRotationPage() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    Record<string, MapRotationType>
  >(import.meta.env.VITE_APEX_LEGENDS_API_MAP_ROTATION_ENDPOINT, {
    refreshInterval: (data) =>
      data ? getDiff(getDate(), data.current.end) : 0,
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
          <div className="text-black text-base">
            An unexpected error occurred while loading the map rotation
          </div>
          <button
            className="px-4 py-2 rounded-md text-white text-xs uppercase bg-apex shadow-sm hover:shadow-sm active:shadow-md shadow-gray-800 hover:shadow-gray-800 active:shadow-gray-800"
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

const mapImage = Object.freeze({
  'Broken Moon': import.meta.env.VITE_APEX_LEGENDS_MAP_BROKEN_MOON_URL,
  'Kings Canyon': import.meta.env.VITE_APEX_LEGENDS_MAP_KINGS_CANYON_URL,
  Olympus: import.meta.env.VITE_APEX_LEGENDS_MAP_OLYMPUS_URL,
  'Storm Point': import.meta.env.VITE_APEX_LEGENDS_MAP_STORM_POINT_URL,
  "World's Edge": import.meta.env.VITE_APEX_LEGENDS_MAP_WORLDS_EDGE_URL,
});

const formatMapSchedule = (unix: number) =>
  format(getDateFromUnix(unix), 'HH:mm');

function MapRotationView({
  current,
  next,
}: {
  current: MapRotationType;
  next: MapRotationType;
}) {
  const currentEnd = getDateFromUnix(current.end);

  useScheduledMapNotification({
    map: next.map,
    when: currentEnd,
  });

  return (
    <div className="flex-grow grid grid-rows-2">
      {Object.values([current, next]).map(({ end, map, start }, index) => {
        const current = index === 0;

        return (
          <div
            className="relative overflow-hidden before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:block before:bg-center before:bg-cover before:hover:scale-125 before:transition-transform before:ease-in-out before:duration-300 before:bg-[image:var(--background-image)]"
            key={`${map}-${start}-${end}`}
            style={
              {
                '--background-image': `url('${
                  mapImage[map as keyof typeof mapImage]
                }')`,
              } as React.CSSProperties
            }
          >
            <div className="p-8 h-[100%] w-[100%] flex flex-col items-start sm:items-center justify-start sm:justify-center backdrop-blur-[2px] hover:backdrop-blur-[1px] transition-[backdrop-filter] ease-in-out duration-300">
              <div className="max-w-lg w-[100%] flex flex-col gap-2">
                {/* Badge */}
                <span
                  className={`self-start p-1 rounded-sm text-xs font-bold uppercase ${
                    current
                      ? 'bg-apex text-white'
                      : 'border-l-4 border-l-gray-400 text-gray-400'
                  }`}
                >
                  {current ? 'Current map' : 'Next map'}
                </span>

                {/* Name */}
                <div className="text-white font-extrabold text-6xl">{map}</div>

                {/* Schedule */}
                <div className="text-gray-300 text-base">
                  From{' '}
                  <span className="text-white font-semibold">
                    {formatMapSchedule(start)}
                  </span>{' '}
                  to{' '}
                  <span className="text-white font-semibold">
                    {formatMapSchedule(end)}
                  </span>
                </div>
              </div>

              {current && (
                <div className="mt-24">
                  <div className="text-gray-300 text-center font-semibold whitespace-nowrap uppercase">
                    Time remaining
                  </div>
                  <div className="text-white text-center font-bold text-3xl">
                    <TimeRemaining to={currentEnd} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
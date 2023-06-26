import TimeRemaining from 'components/time-remaining';
import useScheduledMapNotification from 'hooks/use-scheduled-map-notification';
import { format, getDateFromUnix } from 'lib/datetime';
import useSWR from 'swr';
import MapRotationType from 'types/map-rotation';

enum MapImage {
  'Broken Moon' = 'https://apexlegendsstatus.com/assets/maps/Broken_Moon.png',
  'Kings Canyon' = 'https://apexlegendsstatus.com/assets/maps/Kings_Canyon.png',
  'Olympus' = 'https://apexlegendsstatus.com/assets/maps/Olympus.png',
  'Storm Point' = 'https://apexlegendsstatus.com/assets/maps/Storm_Point.png',
  "World's Edge" = 'https://apexlegendsstatus.com/assets/maps/Worlds_Edge.png',
}

const formatMapSchedule = (unix: number) =>
  format(getDateFromUnix(unix), 'HH:mm');

export default function MapRotationPage() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    Record<string, MapRotationType>
  >(import.meta.env.VITE_APEX_LEGENDS_MAP_ROTATION_ENDPOINT);

  return (
    <div className="min-h-screen pt-12 flex flex-col">
      {isLoading || isValidating ? (
        <div className="flex-grow flex items-center justify-center">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-apex border-r-transparent"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <div className="text-black text-base">
            An unexpected error occurred while loading the map rotation
          </div>
          <button
            className="px-4 py-2 rounded-md text-white text-xs uppercase bg-apex shadow-sm hover:shadow-sm active:shadow-md shadow-gray-800 hover:shadow-gray-800 active:shadow-gray-800"
            onClick={() => mutate()}
          >
            Retry
          </button>
        </div>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <MapRotationView current={data!.current} next={data!.next} />
      )}
    </div>
  );
}

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
                  MapImage[map as keyof typeof MapImage]
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

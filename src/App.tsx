import MapRotation from 'components/map-rotation';
import useSWR from 'swr';
import MapRotationType from 'types/map-rotation';

export default function App() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    Record<string, MapRotationType>
  >(import.meta.env.VITE_APEX_LEGENDS_MAP_ROTATION_ENDPOINT);

  return (
    <div>
      {/* Header */}
      <div className="fixed z-10 top-0 left-0 right-0 h-12 p-2 flex justify-between items-center bg-apex drop-shadow-lg">
        <div className="w-16 flex items-center justify-start">
          <img
            alt="Apex Legends Logo"
            height={32}
            src="https://media.contentapi.ea.com/content/dam/apex-legends/common/logos/apex-white-nav-logo.svg"
            width={48}
          />
        </div>

        <div className="text-white text-lg font-bold uppercase">
          Map Rotation
        </div>

        <div className="w-16 flex items-center justify-end">
          <button className="text-white text-xs uppercase">Settings</button>
        </div>
      </div>

      {/* Content */}
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
          <div className="flex-grow grid grid-rows-2">
            {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              Object.values(data!).map(({ end, map, start }, index) => (
                <MapRotation
                  current={index === 0}
                  end={end}
                  key={`${map}-${start}-${end}`}
                  map={map}
                  start={start}
                />
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

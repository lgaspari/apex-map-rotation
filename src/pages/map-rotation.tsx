import Map from 'components/map';
import Spinner from 'components/spinner';
import useScheduledMapNotification from 'hooks/use-scheduled-map-notification';
import { getDate } from 'lib/datetime';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import type MapRotation from 'types/map-rotation';
import type SeasonMapSchedule from 'types/season-map-schedule';
import type Settings from 'types/settings';

interface MapRotationViewProps {
  mapRotation: MapRotation;
  onCurrentMapEnd: () => void;
  settings: Settings;
}

function MapRotationView({
  mapRotation: { current, next },
  onCurrentMapEnd,
  settings,
}: MapRotationViewProps) {
  useScheduledMapNotification({
    enabled: settings.notifications.maps.includes(next.code),
    map: next,
    threshold: settings.notifications.threshold,
  });

  return (
    <div className="flex-grow grid grid-rows-2">
      <Map current map={current} onEnd={onCurrentMapEnd} />
      <Map map={next} />
    </div>
  );
}

interface MapRotationPageProps {
  settings: Settings;
}

export default function MapRotationPage({ settings }: MapRotationPageProps) {
  const [mapRotation, setMapRotation] = useState<MapRotation | undefined>();

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<SeasonMapSchedule>(
      import.meta.env.VITE_APEX_LEGENDS_SEASON_MAP_SCHEDULE
    );

  const updateMapRotation = useCallback(() => {
    if (data) {
      const index = data.findIndex(
        ({ end, start }) => getDate(start).isBefore() && getDate(end).isAfter()
      );

      setMapRotation({
        current: data[index],
        next: data[index + 1],
      });
    } else {
      setMapRotation(undefined);
    }
  }, [data]);

  useEffect(() => {
    updateMapRotation();
  }, [updateMapRotation]);

  return (
    <div className="flex-grow flex flex-col">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Spinner />
        </div>
      ) : !mapRotation || error ? (
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
            mapRotation={mapRotation}
            onCurrentMapEnd={updateMapRotation}
            settings={settings}
          />

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

import TimeRemaining from 'components/time-remaining';
import { MapCode, MapName } from 'constants/map';
import { ClockIcon } from 'icons';
import { format, getDate } from 'lib/datetime';
import { useEffect, useState } from 'react';
import type MapType from 'types/map';

/**
 * Time remaining threshold to mark map as "ended".
 */
export const HAS_ENDED_THRESHOLD = 5 * 1000; // 5 seconds

/**
 * Time remaining threshold to mark map as "ending".
 */
export const IS_ENDING_THRESHOLD = 15 * 60 * 1000; // 15 minutes

/**
 * Formats date into readable schedule format.
 */
const formatMapSchedule = ({
  date,
  isRankedGameMode,
}: {
  date: ISOString;
  isRankedGameMode: boolean;
}) => format(getDate(date), `${isRankedGameMode ? 'ddd DD, ' : ''}HH:mm`);

const MapImage = Object.freeze(
  Object.values(MapCode).reduce(
    (acc, code) => ({
      ...acc,
      [code]: `${import.meta.env.BASE_URL}assets/maps/${code}.webp`,
    }),
    // hack to prevent typing all object keys
    {} as Record<MapCode, string>
  )
);

export interface MapProps {
  current?: boolean;
  isRankedGameMode?: boolean;
  map: MapType;
}

export default function Map({
  current = false,
  isRankedGameMode = false,
  map: { code, end, start },
}: MapProps) {
  const [hasEnded, setHasEnded] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  /**
   * Reset state whenever map `code` or `start` time changes.
   *
   * We don't rely on `end` time as well because there shouldn't be more than
   * one map with the same code and start time.
   */
  useEffect(() => {
    setHasEnded(false);
    setIsEnding(false);
  }, [code, start]);

  return (
    <div
      className={`relative overflow-hidden before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:block before:bg-center before:bg-cover before:scale-125 before:bg-[image:var(--background-image)] ${
        hasEnded
          ? 'before:scale-100 before:grayscale before:transition-all before:duration-[5000ms]'
          : 'before:hover:scale-150 before:transition-transform before:duration-300'
      }`}
      style={
        {
          '--background-image': `url('${MapImage[code]}')`,
        } as React.CSSProperties
      }
      {...(current
        ? {
            /**
             * Using data attributes to ease assertions when testing.
             */
            'data-has-ended': hasEnded,
            'data-is-ending': isEnding,
            'data-testid': 'map',
          }
        : {})}
    >
      <div
        className={`p-6 sm:p-8 h-[100%] w-[100%] flex flex-col gap-8 sm:gap-24 items-start sm:items-center justify-between sm:justify-center ${
          hasEnded
            ? 'backdrop-blur-[2px] duration-[5000ms]'
            : 'backdrop-blur-[1px] hover:backdrop-blur-[0px] duration-300'
        } transition-[backdrop-filter] ease-in-out`}
      >
        <div className="max-w-lg w-[100%] flex flex-col gap-2">
          {/* Badge */}
          <span
            className={`self-start p-1 border border-white border-opacity-10 rounded-sm shadow-md text-white text-sm font-tt-lakes-w05-regular uppercase ${
              current ? 'bg-apex' : 'bg-gray-600'
            }`}
          >
            {current ? 'Live' : 'Upcoming'}
          </span>

          {/* Name */}
          <div className="text-white text-7xl sm:text-8xl font-duke-fill uppercase">
            {MapName[code]}
          </div>

          {/* Schedule */}
          <div
            className="text-gray-300 text-base font-tt-lakes-w05-light"
            data-testid="map-schedule"
          >
            From{' '}
            <span className="text-white font-tt-lakes-w05-medium">
              {formatMapSchedule({ date: start, isRankedGameMode })}
            </span>{' '}
            to{' '}
            <span className="text-white font-tt-lakes-w05-medium">
              {formatMapSchedule({ date: end, isRankedGameMode })}
            </span>
          </div>
        </div>

        {current && (
          <div
            className={`inline-flex items-center gap-1 font-tt-lakes-w05-regular text-yellow-500 text-3xl sm:text-center ${
              isEnding ? 'animate-pulse' : ''
            }`}
          >
            <ClockIcon className="h-8 w-8" />
            <TimeRemaining
              onTimeRemaining={(timeRemaining) => {
                if (timeRemaining <= IS_ENDING_THRESHOLD && !isEnding) {
                  setIsEnding(true);
                }
                if (timeRemaining <= HAS_ENDED_THRESHOLD && !hasEnded) {
                  setHasEnded(true);
                }
              }}
              to={end}
            />
          </div>
        )}
      </div>
    </div>
  );
}

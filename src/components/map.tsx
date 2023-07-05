import TimeRemaining from 'components/time-remaining';
import { MapImage, MapName } from 'constants/map';
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

const formatMapSchedule = (date: ISOString) => format(getDate(date), 'HH:mm');

export interface MapProps {
  current?: boolean;
  map: MapType;
}

export default function Map({
  current = false,
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
            className={`self-start p-1 rounded-sm text-xs font-bold uppercase ${
              current
                ? 'bg-apex text-white'
                : 'border-l-4 border-l-gray-400 text-gray-400'
            }`}
          >
            {current ? 'Current map' : 'Next map'}
          </span>

          {/* Name */}
          <div className="text-white text-4xl sm:text-6xl font-extrabold">
            {MapName[code]}
          </div>

          {/* Schedule */}
          <div className="text-gray-300 text-base" data-testid="map-schedule">
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
          <div>
            <div className="text-gray-300 text-center font-semibold whitespace-nowrap uppercase">
              Time remaining
            </div>
            <div
              className={`text-white text-3xl text-center font-bold ${
                isEnding ? 'animate-pulse' : ''
              }`}
            >
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
          </div>
        )}
      </div>
    </div>
  );
}

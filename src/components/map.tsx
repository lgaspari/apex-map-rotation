import TimeRemaining from 'components/time-remaining';
import { MapImage, MapName } from 'constants/map';
import { format } from 'lib/datetime';
import type MapType from 'types/map';

export interface MapProps {
  current?: boolean;
  map: MapType;
}

const formatMapSchedule = (date: DateObject) => format(date, 'HH:mm');

export default function Map({
  current = false,
  map: { code, end, start },
}: MapProps) {
  return (
    <div
      className="relative overflow-hidden before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:block before:bg-center before:bg-cover before:hover:scale-125 before:transition-transform before:ease-in-out before:duration-300 before:bg-[image:var(--background-image)]"
      style={
        {
          '--background-image': `url('${MapImage[code]}')`,
        } as React.CSSProperties
      }
    >
      <div className="p-6 sm:p-8 h-[100%] w-[100%] flex flex-col gap-8 sm:gap-24 items-start sm:items-center justify-between sm:justify-center backdrop-blur-[2px] hover:backdrop-blur-[1px] transition-[backdrop-filter] ease-in-out duration-300">
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
            <div className="text-white text-center font-bold text-3xl">
              <TimeRemaining to={end.valueOf()} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import TimeRemaining from 'components/time-remaining';
import { format, fromUnix } from 'lib/datetime';

const formatTime = (timestamp: number) => format(fromUnix(timestamp), 'HH:mm');

enum MapImage {
  'Broken Moon' = 'https://apexlegendsstatus.com/assets/maps/Broken_Moon.png',
  'Kings Canyon' = 'https://apexlegendsstatus.com/assets/maps/Kings_Canyon.png',
  'Olympus' = 'https://apexlegendsstatus.com/assets/maps/Olympus.png',
  'Storm Point' = 'https://apexlegendsstatus.com/assets/maps/Storm_Point.png',
  "World's Edge" = 'https://apexlegendsstatus.com/assets/maps/Worlds_Edge.png',
}

interface MapRotationProps {
  current: boolean;
  end: number;
  map: string;
  start: number;
}

export default function MapRotation({
  current,
  end,
  map,
  start,
}: MapRotationProps) {
  return (
    <div
      className="relative overflow-hidden before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:block before:bg-center before:bg-cover before:hover:scale-125 before:transition-transform before:ease-in-out before:duration-300 before:bg-[image:var(--background-image)]"
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
              {formatTime(start)}
            </span>{' '}
            to{' '}
            <span className="text-white font-semibold">{formatTime(end)}</span>
          </div>
        </div>

        {current && (
          <div className="mt-24">
            <div className="text-gray-300 text-center font-semibold whitespace-nowrap uppercase">
              Time remaining
            </div>
            <div className="text-white text-center font-bold text-3xl">
              <TimeRemaining to={end} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

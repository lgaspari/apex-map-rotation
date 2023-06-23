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
  remaining?: number;
  start: number;
}

export default function MapRotation({
  current,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  end,
  map,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  start,
  remaining,
}: MapRotationProps) {
  return (
    <div
      className="bg-cover"
      style={{
        backgroundImage: `url('${MapImage[map as keyof typeof MapImage]}')`,
      }}
    >
      <div className="p-8 h-[100%] w-[100%] flex flex-col items-start sm:items-center justify-start sm:justify-center backdrop-blur-[2px]">
        <div className="flex flex-col gap-2">
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
            From <span className="text-white font-semibold">00:30</span> to{' '}
            <span className="text-white font-semibold">02:00</span>
          </div>
        </div>

        {remaining && (
          <div className="mt-24">
            <div className="text-gray-300 text-center font-semibold whitespace-nowrap uppercase">
              Time remaining
            </div>
            <div className="text-white text-center font-bold text-3xl">
              00:43:37
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import MapRotation from 'components/map-rotation';
import mapRotationResponse from 'mocks/map-rotation-response.json';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
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
      <div className="pt-12 flex-grow grid grid-rows-2">
        {Object.values(mapRotationResponse).map(
          ({ end, map, start }, index) => (
            <MapRotation
              current={index === 0}
              end={end}
              key={`${map}-${start}-${end}`}
              map={map}
              start={start}
            />
          )
        )}
      </div>
    </div>
  );
}

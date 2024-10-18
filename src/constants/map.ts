export enum MapCode {
  BrokenMoon = 'broken_moon',
  EDistrict = 'edistrict',
  KingsCanyon = 'kings_canyon',
  Olympus = 'olympus',
  StormPoint = 'storm_point',
  WorldsEdge = 'worlds_edge',
}

export const MapImage = Object.freeze(
  Object.values(MapCode).reduce(
    (acc, code) => ({
      ...acc,
      [code]: `${import.meta.env.BASE_URL}assets/maps/${code}.webp`,
    }),
    // hack to prevent typing all object keys
    {} as Record<MapCode, string>
  )
);

export const MapName: Record<MapCode, string> = Object.freeze({
  [MapCode.BrokenMoon]: 'Broken Moon',
  [MapCode.EDistrict]: 'E-District',
  [MapCode.KingsCanyon]: 'Kings Canyon',
  [MapCode.Olympus]: 'Olympus',
  [MapCode.StormPoint]: 'Storm Point',
  [MapCode.WorldsEdge]: "World's Edge",
});

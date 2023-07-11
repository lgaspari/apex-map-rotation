export enum MapCode {
  BrokenMoon = 'broken_moon',
  KingsCanyon = 'kings_canyon',
  Olympus = 'olympus',
  StormPoint = 'storm_point',
  WorldsEdge = 'worlds_edge',
}

export const MapName: Record<MapCode, string> = Object.freeze({
  [MapCode.BrokenMoon]: 'Broken Moon',
  [MapCode.KingsCanyon]: 'Kings Canyon',
  [MapCode.Olympus]: 'Olympus',
  [MapCode.StormPoint]: 'Storm Point',
  [MapCode.WorldsEdge]: "World's Edge",
});

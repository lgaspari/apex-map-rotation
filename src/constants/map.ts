export enum MapCode {
  BrokenMoon = 'broken_moon',
  KingsCanyon = 'kings_canyon',
  Olympus = 'olympus',
  StormPoint = 'storm_point',
  WorldsEdge = 'worlds_edge',
}

export const MapImage: Record<MapCode, string> = Object.freeze({
  [MapCode.BrokenMoon]: import.meta.env.VITE_APEX_LEGENDS_MAP_BROKEN_MOON_URL,
  [MapCode.KingsCanyon]: import.meta.env.VITE_APEX_LEGENDS_MAP_KINGS_CANYON_URL,
  [MapCode.Olympus]: import.meta.env.VITE_APEX_LEGENDS_MAP_OLYMPUS_URL,
  [MapCode.StormPoint]: import.meta.env.VITE_APEX_LEGENDS_MAP_STORM_POINT_URL,
  [MapCode.WorldsEdge]: import.meta.env.VITE_APEX_LEGENDS_MAP_WORLDS_EDGE_URL,
});

export const MapName: Record<MapCode, string> = Object.freeze({
  [MapCode.BrokenMoon]: 'Broken Moon',
  [MapCode.KingsCanyon]: 'Kings Canyon',
  [MapCode.Olympus]: 'Olympus',
  [MapCode.StormPoint]: 'Storm Point',
  [MapCode.WorldsEdge]: "World's Edge",
});

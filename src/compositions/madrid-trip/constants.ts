export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Map-scene timeline (local frames). */
export const T = {
  zoomEnd: 120, // zoom out from Madrid
  leg1: [120, 270] as const, // Madrid -> New York
  pause: [270, 300] as const, // beat in New York
  leg2: [300, 450] as const, // New York -> Paris
  end: 480, // camera pushes in on Paris while the scene cross-fades
};

export const MAP_DURATION = T.end;
export const EIFFEL_DURATION = 270;
export const FADE = 30;
export const MADRID_TRIP_DURATION = MAP_DURATION + EIFFEL_DURATION - FADE; // 720

/** Camera zoom once Madrid is framed (world px -> screen px). */
export const BASE_ZOOM = 2.2;

export type LonLat = [number, number];

export const CITIES = {
  madrid: { name: "Madrid", lonLat: [-3.7038, 40.4168] as LonLat },
  newYork: { name: "New York", lonLat: [-74.006, 40.7128] as LonLat },
  paris: { name: "Paris", lonLat: [2.3522, 48.8566] as LonLat },
};

export const COLORS = {
  ocean: "#08101f",
  oceanGlow: "#12203f",
  land: "#14213d",
  border: "#2a4070",
  coast: "#5a7fc4",
  grid: "#1a2a4d",
  route: "#ffb347",
  routeGhost: "#6b7fa8",
  text: "#f4efe6",
};

export const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

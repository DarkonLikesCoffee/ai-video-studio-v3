import { getLength } from "@remotion/paths";
import {
  geoGraticule10,
  geoInterpolate,
  geoMercator,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { CITIES, type LonLat } from "./constants";

// Everything here is pure and runs once at module load, so every frame
// renders from the same precomputed geometry.
const projection = geoMercator().scale(600).translate([0, 0]);
const toPath = geoPath(projection).digits(2);

const topology = world as unknown as Topology;
const countries = topology.objects.countries as GeometryCollection<{
  name: string;
}>;

const land = feature(topology, countries);
const landWithoutAntarctica = {
  type: "FeatureCollection",
  features: land.features.filter((f) => f.properties.name !== "Antarctica"),
} as GeoPermissibleObjects;

export const landPath = toPath(landWithoutAntarctica) ?? "";
export const bordersPath =
  toPath(mesh(topology, countries, (a, b) => a !== b)) ?? "";
export const graticulePath = toPath(geoGraticule10()) ?? "";

export const project = (lonLat: LonLat): [number, number] =>
  projection(lonLat) as [number, number];

export const MADRID_XY = project(CITIES.madrid.lonLat);
export const NEW_YORK_XY = project(CITIES.newYork.lonLat);
export const PARIS_XY = project(CITIES.paris.lonLat);

/** Great-circle arc projected to Mercator, as an SVG path. */
const arc = (from: LonLat, to: LonLat, steps = 140): string => {
  const interpolate = geoInterpolate(from, to);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const [x, y] = project(interpolate(i / steps) as LonLat);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
};

export const ROUTE_1 = arc(CITIES.madrid.lonLat, CITIES.newYork.lonLat);
export const ROUTE_2 = arc(CITIES.newYork.lonLat, CITIES.paris.lonLat);
export const ROUTE_1_LENGTH = getLength(ROUTE_1);
export const ROUTE_2_LENGTH = getLength(ROUTE_2);

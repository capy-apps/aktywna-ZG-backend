import { XMLParser } from 'fast-xml-parser';
import { Location } from '../types/Location';

export const parseGpx = (gpxString: string): Location[] => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: ''
  });

  const gpx = parser.parse(gpxString);

  if (!gpx.gpx || !gpx.gpx.trk || !gpx.gpx.trk.trkseg) {
    throw new Error("Invalid GPX format");
  }

  const trackSegments = Array.isArray(gpx.gpx.trk.trkseg)
    ? gpx.gpx.trk.trkseg
    : [gpx.gpx.trk.trkseg];

  const locations: Location[] = [];

  trackSegments.forEach((segment: any) => {
    if (segment.trkpt && Array.isArray(segment.trkpt)) {
      segment.trkpt.forEach((point: any) => {
        const lat = parseFloat(point.lat);
        const lon = parseFloat(point.lon);

        locations.push({
          latitude: lat,
          longitude: lon
        });
      });
    }
  });

  return locations;
};
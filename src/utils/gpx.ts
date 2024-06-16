import { XMLParser } from 'fast-xml-parser';
import { Location } from '../types/Location';


//Funkcja parsująca plik GPX na tablicę obiektów z lokalizacjami
export const parseGpx = (gpxString: string): Location[] => {
  //Parser XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: ''
  });

  //Parsowanie pliku GPX
  const gpx = parser.parse(gpxString);

  //Sprawdzenie czy plik jest w formacie GPX
  if (!gpx.gpx || !gpx.gpx.trk || !gpx.gpx.trk.trkseg) {
    throw new Error("Invalid GPX format");
  }

  //Sprawdzenie czy segment trasy jest tablicą
  const trackSegments = Array.isArray(gpx.gpx.trk.trkseg)
    ? gpx.gpx.trk.trkseg
    : [gpx.gpx.trk.trkseg];


  const locations: Location[] = [];

  //Iteracja po segmentach trasy i dodanie punktów do tablicy lokalizacji
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
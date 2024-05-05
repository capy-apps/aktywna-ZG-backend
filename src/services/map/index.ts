import { Env } from '../../types';
import { BikeTrips, BikeTripsRequest } from '../../types/BikeTrips';
import { Location } from '../../types/Location';
import { parseGpx } from '../../utils/gpx';

export const mapService = async (env: Env) => {
	const getAllBikeTrips = async (): Promise<Response> => {
		const query = env.DB.prepare('SELECT * FROM BikeTrips');
		const { results } = await query.all<BikeTrips>();
		return Response.json(results);
	};

  const getBikeTrips = async (bikeTripsId: Number): Promise<Response> => {
    const tripQuery = env.DB.prepare('SELECT * FROM BikeTrips WHERE id = ?');
    const bikeTrips = await tripQuery.bind(bikeTripsId).first<BikeTrips>();
  
		const query = env.DB.prepare('SELECT latitude, longitude FROM BikeTripLocations WHERE trip_id = ?')
		const { results: locationResults } = await query.bind(bikeTripsId).all<Location>();

    const BikeTripsWithLocations = {
      ...bikeTrips,
      locations: locationResults,
    };

		return Response.json(BikeTripsWithLocations);
	};

	const addBikeTrips = async (BikeTrips: BikeTripsRequest): Promise<Response> => {
		const query = await env.DB.prepare(
			'INSERT INTO BikeTrips (name, length, difficulty, description, image, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
		)
			.bind(
				BikeTrips.name,
				BikeTrips.length,
				BikeTrips.difficulty,
				BikeTrips.description,
				BikeTrips.image,
				Date.now()
			)
			.run();

		return Response.json({
			id: query.meta.last_row_id,
			...BikeTrips,
			created_at: Date.now(),
		});
	};

  const addBikeTripsLocation = async (bikeTripsId: number, gpxContent: string): Promise<Response> => {
    const locations = parseGpx(gpxContent);

    const query = env.DB.prepare(
      'INSERT INTO BikeTripLocations (trip_id, latitude, longitude) VALUES (?1, ?2, ?3)'
    );

    const rows = await env.DB.batch([
      ...locations.map((location) =>
        query.bind(bikeTripsId, location.latitute, location.longitude)
      ),
    ]);

    console.log(rows[0].results);

    return Response.json({ message: 'Locations added successfully' });
  }

	return {
		getAllBikeTrips,
    getBikeTrips,
		addBikeTrips,
    addBikeTripsLocation,
	};
};

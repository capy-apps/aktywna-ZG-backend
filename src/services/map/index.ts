import { Env } from '../../types';
import { BikePath, BikePathRequest } from '../../types/BikePath';
import { Location } from '../../types/Location';
import { parseGpx } from '../../utils/gpx';

export const mapService = async (env: Env) => {
	const getAllBikePaths = async (): Promise<Response> => {
		const query = env.DB.prepare('SELECT * FROM BikePaths');
		const { results } = await query.all<BikePath>();
		return Response.json(results);
	};

  const getBikePath = async (bikePathId: Number): Promise<Response> => {
    const pathQuery = env.DB.prepare('SELECT * FROM BikePaths WHERE id = ?');
    const bikePath = await pathQuery.bind(bikePathId).first<BikePath>();
  
		const query = env.DB.prepare('SELECT latitude, longitude FROM BikePathLocations WHERE path_id = ?')
		const { results: locationResults } = await query.bind(bikePathId).all<Location>();

    const bikePathWithLocations = {
      ...bikePath,
      locations: locationResults,
    };

		return Response.json(bikePathWithLocations);
	};

	const addBikePath = async (bikePath: BikePathRequest): Promise<Response> => {
		const query = await env.DB.prepare(
			'INSERT INTO BikePaths (name, length, difficulty, description, image, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
		)
			.bind(
				bikePath.name,
				bikePath.length,
				bikePath.difficulty,
				bikePath.description,
				bikePath.image,
				Date.now()
			)
			.run();

		return Response.json({
			id: query.meta.last_row_id,
			...bikePath,
			created_at: Date.now(),
		});
	};

  const addBikePathLocation = async (bikePathId: number, gpxContent: string): Promise<Response> => {
    const locations = parseGpx(gpxContent);

    const query = env.DB.prepare(
      'INSERT INTO BikePathLocations (path_id, latitude, longitude) VALUES (?1, ?2, ?3)'
    );

    const rows = await env.DB.batch([
      ...locations.map((location) =>
        query.bind(bikePathId, location.latitute, location.longitude)
      ),
    ]);

    console.log(rows[0].results);

    return Response.json({ message: 'Locations added successfully' });
  }

	return {
		getAllBikePaths,
    getBikePath,
		addBikePath,
    addBikePathLocation,
	};
};

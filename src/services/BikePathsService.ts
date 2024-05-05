import { Env } from '../types';
import { BikePaths, BikePathsRequest } from '../types/BikePaths';
import { Location } from '../types/Location';
import { parseGpx } from '../utils/gpx';

export const BikePathsService = async (env: Env) => {
	const getAllBikePaths = async (): Promise<Response> => {
		const query = env.DB.prepare('SELECT * FROM BikePaths');
		const { results } = await query.all<BikePaths>();
		return Response.json(results);
	};

	const getBikePath = async (bikePathId: Number): Promise<Response> => {
		const pathQuery = env.DB.prepare('SELECT * FROM BikePaths WHERE id = ?');
		const bikePath = await pathQuery.bind(bikePathId).first<BikePaths>();

		const query = env.DB.prepare(
			'SELECT latitude, longitude FROM BikePathLocations WHERE path_id = ?'
		);
		const { results: locationResults } = await query.bind(bikePathId).all<Location>();

		const BikePathWithLocations = {
			...bikePath,
			locations: locationResults,
		};

		return Response.json(BikePathWithLocations);
	};

	const addBikePath = async (bikePath: BikePathsRequest): Promise<Response> => {
		const query = await env.DB.prepare('INSERT INTO BikePaths (name, length) VALUES (?1, ?2)')
			.bind(bikePath.name, bikePath.length)
			.run();

		return Response.json({
			id: query.meta.last_row_id,
			...bikePath,
		});
	};

	const addBikePathLocation = async (bikePathId: number, gpxContent: string): Promise<Response> => {
		const locations = parseGpx(gpxContent);

		const query = env.DB.prepare(
			'INSERT INTO BikePathLocations (path_id, latitude, longitude) VALUES (?1, ?2, ?3)'
		);

		const rows = await env.DB.batch([
			...locations.map(location => query.bind(bikePathId, location.latitute, location.longitude)),
		]);

		return Response.json({ message: 'Locations added successfully' });
	};

	return {
		getAllBikePaths,
		getBikePath,
		addBikePath,
		addBikePathLocation,
	};
};

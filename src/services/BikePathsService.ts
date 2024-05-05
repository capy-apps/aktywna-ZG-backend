import { Env } from '../types';
import { BikePaths, BikePathsLocation, BikePathsRequest } from '../types/BikePaths';
import { parseGpx } from '../utils/gpx';

export const BikePathsService = async (env: Env) => {
	const getAllBikePaths = async (): Promise<Response> => {
		const bikePaths = env.DB.prepare('SELECT * FROM BikePaths');
		const { results } = await bikePaths.all<BikePaths>();

		const bikePathLocations = env.DB.prepare('SELECT * FROM BikePathLocations');
		const { results: locations } = await bikePathLocations.all<BikePathsLocation>();

		const bikePathsWithLocations = results.map(path => ({
			...path,
			locations: locations
				.filter(location => location.path_id === path.id)
				.map(location => ({
					latitude: location.latitude,
					longitude: location.longitude,
				})),
		}));

		return Response.json(bikePathsWithLocations);
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
		addBikePath,
		addBikePathLocation,
	};
};

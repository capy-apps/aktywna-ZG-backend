import { Env } from '../types';
import { BikePaths, BikePathsLocation, BikePathsRequest } from '../types/BikePaths';
import { calculateTotalDistance } from '../utils/distance';
import { parseGpx } from '../utils/gpx';

//Serwis obsługujący ścieżki rowerowe
export const BikePathsService = async (env: Env) => {
	//funkcja zwracająca odpowiedź ze wszystkimi ścieżkami rowerowymi i ich lokalizacjami
	const getAllBikePaths = async (): Promise<Response> => {
		//pobranie wszystkich ścieżek rowerowych
		const bikePaths = env.DB.prepare('SELECT * FROM BikePaths');
		const { results } = await bikePaths.all<BikePaths>();
		//pobranie wszystkich lokalizacji ścieżek rowerowych
		const bikePathLocations = env.DB.prepare('SELECT * FROM BikePathLocations');
		const { results: locations } = await bikePathLocations.all<BikePathsLocation>();

		//dodanie lokalizacji do ścieżek rowerowych
		const bikePathsWithLocations = results.map(path => ({
			...path,
			locations: locations
				.filter(location => location.path_id === path.id)
				.map(location => ({
					latitude: location.latitude,
					longitude: location.longitude,
				})),
		}));

		//zwrócenie odpowiedzi
		return Response.json(bikePathsWithLocations);
	};

	//funkcja dodająca ścieżkę rowerową
	const addBikePath = async (bikePath: BikePathsRequest): Promise<Response> => {
		//dodanie ścieżki rowerowej do bazy danych
		const query = await env.DB.prepare('INSERT INTO BikePaths (name) VALUES (?)')
			.bind(bikePath.name)
			.run();

		//zwrócenie odpowiedzi
		return Response.json({
			id: query.meta.last_row_id,
			...bikePath,
		});
	};

	//funkcja dodająca lokalizacje na ścieżce rowerowej
	const addBikePathLocation = async (bikePathId: number, gpxContent: string): Promise<Response> => {
		//parsowanie pliku GPX
		const locations = parseGpx(gpxContent);
		//obliczenie całkowitego dystansu
		const totalDistance = calculateTotalDistance(locations);
	//aktualizacja długości ścieżki rowerowej
    const pathQuery = env.DB.prepare('UPDATE BikePaths SET length = ? WHERE id = ?');
		//dodanie lokalizacji do ścieżki rowerowej
		const query = env.DB.prepare(
			'INSERT INTO BikePathLocations (path_id, latitude, longitude) VALUES (?1, ?2, ?3)'
		);

		//dodanie wszystkich lokalizacji do bazy danych
		const rows = await env.DB.batch([
      pathQuery.bind(totalDistance, bikePathId),
			...locations.map(location => query.bind(bikePathId, location.latitude, location.longitude)),
		]);

		//zwrócenie odpowiedzi
		return Response.json({ message: 'Locations added successfully' });
	};

	//funkcja aktualizująca ścieżkę rowerową
	const updateBikePath = async (id: number, bikePath: BikePathsRequest): Promise<Response> => {
		//aktualizacja nazwy ścieżki rowerowej w bazie danych
		const query = await env.DB.prepare('UPDATE BikePaths SET name = ? WHERE id = ?')
			.bind(bikePath.name, id)
			.run();
		//zwrócenie odpowiedzi
		return Response.json({
			id,
			...bikePath,
		});
	}

	//funkcja usuwająca ścieżkę rowerową o podanym id
	const deleteBikePath = async (id: number): Promise<Response> => {
		//usunięcie ścieżki rowerowej z bazy danych
		const query = await env.DB.prepare('DELETE FROM BikePaths WHERE id = ?')
			.bind(id)
			.run();
		//zwrócenie odpowiedzi
		return Response.json({ status: 'success' });
	};

	//zwrócenie funkcji
	return {
		getAllBikePaths,
		addBikePath,
		addBikePathLocation,
		updateBikePath,
		deleteBikePath,
	};
};

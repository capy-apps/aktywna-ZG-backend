import { i } from 'vitest/dist/index-5aad25c1';
import { Env } from '../types';
import { BikeTrips, BikeTripsRequest } from '../types/BikeTrips';
import { Location } from '../types/Location';
import { calculateTotalDistance } from '../utils/distance';
import { parseGpx } from '../utils/gpx';
import { arrayBufferToBase64 } from '../utils/buffer';

//Serwis obsługujący trasy rowerowe
export const BikeTripsService = async (env: Env) => {
	//funkcja zwracająca odpowiedź ze wszystkimi trasami rowerowymi
	const getAllBikeTrips = async (isAdmin: boolean): Promise<Response> => {
		const query = env.DB.prepare(
			`SELECT 
            BikeTrips.id,
						BikeTrips.public,
            BikeTrips.name, 
            BikeTrips.length, 
            BikeTrips.difficulty, 
            BikeTrips.description, 
            BikeTrips.created_at, 
            AVG(BikeTripsRatings.rating) AS rating 
         FROM BikeTrips 
         LEFT JOIN BikeTripsRatings ON BikeTrips.id = BikeTripsRatings.trip_id 
         ${isAdmin ? '' : 'WHERE BikeTrips.public = 1'} 
         GROUP BY 
            BikeTrips.id,
            BikeTrips.name, 
            BikeTrips.length, 
            BikeTrips.difficulty, 
            BikeTrips.description, 
            BikeTrips.created_at`
		);
		const { results } = await query.all<BikeTrips>();
		return Response.json(results);
	};

	//funkcja zwracająca odpowiedź z trasą rowerową o podanym id
	const getBikeTrips = async (bikeTripsId: number): Promise<Response> => {
		const tripQuery = env.DB.prepare('SELECT * FROM BikeTrips WHERE id = ?');
		const bikeTrips = await tripQuery.bind(bikeTripsId).first<BikeTrips>();

		//jeśli trasa rowerowa nie istnieje zwracamy odpowiedz z stastusem 404
		if (!bikeTrips) {
			return Response.json({ error: 'Bike trip not found' }, { status: 404 });
		}

		//pobranie lokalizacji trasy rowerowej
		const locationQuery = env.DB.prepare(
			'SELECT latitude, longitude FROM BikeTripLocations WHERE trip_id = ?'
		);
		const { results: locationResults } = await locationQuery.bind(bikeTripsId).all<Location>();

		//pobranie ocen trasy rowerowej
		const ratingQuery = env.DB.prepare(
			'SELECT COALESCE(AVG(rating), 0) AS rating FROM BikeTripsRatings WHERE trip_id = ?'
		);
		const ratingResult = await ratingQuery.bind(bikeTripsId).first<{ rating: number }>();

		//pobranie zdjęć trasy rowerowej
		const photoQuery = env.DB.prepare(
			'SELECT id, public, image FROM BikeTripsPhotos WHERE trip_id = ?'
		);
		const { results: photoResults } = await photoQuery
			.bind(bikeTripsId)
			.all<{ id: number; public: number; image: ArrayBuffer }>();

		const photos = photoResults
			.filter(photo => photo.public === 1)
			.map(photo => {
				return {
					id: photo.id,
					image: arrayBufferToBase64(photo.image),
				};
			});

		const BikeTripsWithDetails = {
			...bikeTrips,
			locations: locationResults,
			rating: ratingResult?.rating,
			photos,
		};

		return Response.json(BikeTripsWithDetails);
	};

	//funkcja dodająca trasę rowerową
	const addBikeTrips = async (BikeTrips: BikeTripsRequest, isAdmin: boolean): Promise<Response> => {
		//dodanie trasy rowerowej do bazy danych
		const query = await env.DB.prepare(
			'INSERT INTO BikeTrips (name, public, difficulty, description, created_at) VALUES (?1, ?2, ?3, ?4, ?5)'
		)
			.bind(
				BikeTrips.name,
				isAdmin ? 1 : 0,
				BikeTrips.difficulty,
				BikeTrips.description,
				Date.now()
			)
			.run();
		//zwrócenie odpowiedzi
		return Response.json({
			id: query.meta.last_row_id,
			...BikeTrips,
			created_at: Date.now(),
		});
	};

	//funkcja dodająca lokalizacje do trasy rowerowej
	const addBikeTripsLocation = async (
		bikeTripsId: number,
		gpxContent: string
	): Promise<Response> => {
		//parsowanie pliku GPX
		const locations = parseGpx(gpxContent);
		const totalDistance = calculateTotalDistance(locations);

		//aktualizacja długości trasy rowerowej
		const tripQuery = env.DB.prepare('UPDATE BikeTrips SET length = ? WHERE id = ?');

		//dodanie lokalizacji do trasy rowerowej
		const query = env.DB.prepare(
			'INSERT INTO BikeTripLocations (trip_id, latitude, longitude) VALUES (?1, ?2, ?3)'
		);

		//wykonanie zapytań
		const rows = await env.DB.batch([
			tripQuery.bind(totalDistance, bikeTripsId),
			...locations.map(location => query.bind(bikeTripsId, location.latitude, location.longitude)),
		]);

		return Response.json({ message: 'Locations added successfully' });
	};

	//funkcja dodająca ocenę trasy rowerowej
	const rateBikeTrips = async (id: number, rating: number): Promise<Response> => {
		//dodanie oceny do bazy danych
		const query = await env.DB.prepare(
			'INSERT INTO BikeTripsRatings (trip_id, rating) VALUES (?1, ?2)'
		)
			.bind(id, rating)
			.run();

		return Response.json({ status: 'success' });
	};

	//funkcja aktualizująca trasę rowerową
	const updateBikeTrips = async (id: number, BikeTrips: BikeTripsRequest): Promise<Response> => {
		//aktualizacja trasy rowerowej w bazie danych
		const query = await env.DB.prepare(
			'UPDATE BikeTrips SET name = ?1, difficulty = ?2, description = ?3, WHERE id = ?4'
		)
			.bind(BikeTrips.name, BikeTrips.difficulty, BikeTrips.description, id)
			.run();

		return Response.json({
			id,
			...BikeTrips,
		});
	};

	//funkcja usuwająca trasę rowerową
	const deleteBikeTrips = async (id: number): Promise<Response> => {
		//usunięcie trasy rowerowej z bazy danych
		const query = await env.DB.prepare('DELETE FROM BikeTrips WHERE id = ?1').bind(id).run();
		return Response.json({ status: 'success' });
	};

	//funkcja zwracająca odpowiedź ze zdjęciem o podanym id
	const getPhoto = async (id: number): Promise<Response> => {
		//pobranie zdjęcia z bazy danych
		const image = await env.DB.prepare('SELECT image FROM BikeTripsPhotos WHERE id = ?')
			.bind(id)
			.first<{ image: ArrayBuffer }>();

		//jeśli zdjęcie nie istnieje zwracamy odpowiedz z statusem 404
		if (!image) {
			return new Response('Image not found', { status: 404 });
		}

		//zwrócenie odpowiedzi z zdjęciem
		const imageBuffer = arrayBufferToBase64(image.image);
		return new Response(imageBuffer);
	};

	//funkcja zwracająca odpowiedź ze wszystkimi prywatnymi zdjęciami ktore nie są publiczne
	const getAllPrivatePhotos = async (): Promise<Response> => {
		//pobranie wszystkich prywatnych zdjęć z bazy danych
		const query = await env.DB.prepare('SELECT * FROM BikeTripsPhotos WHERE public = 0');
		//przygotowanie odpowiedzi i wysłanie jej
		const { results } = await query.all<{
			id: number;
			trip_id: number;
			public: number;
			image: ArrayBuffer;
		}>();
		return Response.json(
			results.map(photo => {
				return {
					id: photo.id,
					trip_id: photo.trip_id,
					public: photo.public,
					photo: arrayBufferToBase64(photo.image),
				};
			})
		);
	};

	//funkcja dodająca zdjęcie do trasy rowerowej
	const addPhoto = async (
		tripId: number,
		image: ArrayBuffer,
		isAdmin: boolean
	): Promise<Response> => {
		//dodanie zdjęcia do bazy danych
		const query = await env.DB.prepare(
			'INSERT INTO BikeTripsPhotos (trip_id, public, image, created_at) VALUES (?1, ?2, ?3, ?4)'
		)
			.bind(tripId, isAdmin ? 1 : 0, image, Date.now())
			.run();

		return Response.json({ status: 'success' });
	};

	//funkcja usuwająca zdjęcie
	const deletePhoto = async (id: number): Promise<Response> => {
		//usunięcie zdjęcia z bazy danych
		const query = await env.DB.prepare('DELETE FROM BikeTripsPhotos WHERE id = ?').bind(id).run();

		return Response.json({ status: 'success' });
	};

	//funkcja ustawiająca trasę rowerową jako publiczną
	const publicBikeTrip = async (id: number): Promise<Response> => {
		//ustawienie trasy rowerowej jako publicznej w bazie danych
		const query = await env.DB.prepare('UPDATE BikeTrips SET public = 1 WHERE id = ?')
			.bind(id)
			.run();
		return Response.json({ status: 'success' });
	};

	//funkcja ustawiająca zdjęcie jako publiczne
	const publicPhoto = async (id: number): Promise<Response> => {
		//ustawienie zdjęcia jako publiczne w bazie danych
		const query = await env.DB.prepare('UPDATE BikeTripsPhotos SET public = 1 WHERE id = ?')
			.bind(id)
			.run();
		return Response.json({ status: 'success' });
	};

	//zwrócenie funkcji
	return {
		getAllBikeTrips,
		getBikeTrips,
		addBikeTrips,
		rateBikeTrips,
		addBikeTripsLocation,
		updateBikeTrips,
		deleteBikeTrips,
		getAllPrivatePhotos,
		getPhoto,
		addPhoto,
		deletePhoto,
		publicBikeTrip,
		publicPhoto,
	};
};

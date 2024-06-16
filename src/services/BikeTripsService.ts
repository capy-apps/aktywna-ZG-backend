import { i } from 'vitest/dist/index-5aad25c1';
import { Env } from '../types';
import { BikeTrips, BikeTripsRequest } from '../types/BikeTrips';
import { Location } from '../types/Location';
import { calculateTotalDistance } from '../utils/distance';
import { parseGpx } from '../utils/gpx';
import { arrayBufferToBase64 } from '../utils/buffer';

export const BikeTripsService = async (env: Env) => {
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

	const getBikeTrips = async (bikeTripsId: number): Promise<Response> => {
		const tripQuery = env.DB.prepare('SELECT * FROM BikeTrips WHERE id = ?');
		const bikeTrips = await tripQuery.bind(bikeTripsId).first<BikeTrips>();

		if (!bikeTrips) {
			return Response.json({ error: 'Bike trip not found' }, { status: 404 });
		}

		const locationQuery = env.DB.prepare(
			'SELECT latitude, longitude FROM BikeTripLocations WHERE trip_id = ?'
		);
		const { results: locationResults } = await locationQuery.bind(bikeTripsId).all<Location>();

		const ratingQuery = env.DB.prepare(
			'SELECT COALESCE(AVG(rating), 0) AS rating FROM BikeTripsRatings WHERE trip_id = ?'
		);
		const ratingResult = await ratingQuery.bind(bikeTripsId).first<{ rating: number }>();

		const photoQuery = env.DB.prepare('SELECT id, public FROM BikeTripsPhotos WHERE trip_id = ?');
		const { results: photoResults } = await photoQuery
			.bind(bikeTripsId)
			.all<{ id: number; public: number }>();

		const BikeTripsWithDetails = {
			...bikeTrips,
			locations: locationResults,
			rating: ratingResult?.rating,
			photos: photoResults.filter(photo => photo.public === 1).map(photo => photo.id),
		};

		return Response.json(BikeTripsWithDetails);
	};

	const addBikeTrips = async (BikeTrips: BikeTripsRequest, isAdmin: boolean): Promise<Response> => {
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

		return Response.json({
			id: query.meta.last_row_id,
			...BikeTrips,
			created_at: Date.now(),
		});
	};

	const addBikeTripsLocation = async (
		bikeTripsId: number,
		gpxContent: string
	): Promise<Response> => {
		const locations = parseGpx(gpxContent);
		const totalDistance = calculateTotalDistance(locations);

		const tripQuery = env.DB.prepare('UPDATE BikeTrips SET length = ? WHERE id = ?');

		const query = env.DB.prepare(
			'INSERT INTO BikeTripLocations (trip_id, latitude, longitude) VALUES (?1, ?2, ?3)'
		);

		const rows = await env.DB.batch([
			tripQuery.bind(totalDistance, bikeTripsId),
			...locations.map(location => query.bind(bikeTripsId, location.latitude, location.longitude)),
		]);

		return Response.json({ message: 'Locations added successfully' });
	};

	const rateBikeTrips = async (id: number, rating: number): Promise<Response> => {
		const query = await env.DB.prepare(
			'INSERT INTO BikeTripsRatings (trip_id, rating) VALUES (?1, ?2)'
		)
			.bind(id, rating)
			.run();

		return Response.json({ status: 'success' });
	};

	const updateBikeTrips = async (id: number, BikeTrips: BikeTripsRequest): Promise<Response> => {
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

	const deleteBikeTrips = async (id: number): Promise<Response> => {
		const query = await env.DB.prepare('DELETE FROM BikeTrips WHERE id = ?1').bind(id).run();
		return Response.json({ status: 'success' });
	};

	const getPhoto = async (id: number): Promise<Response> => {
		const image = await env.DB.prepare('SELECT image FROM BikeTripsPhotos WHERE id = ?')
			.bind(id)
			.first<{ image: ArrayBuffer }>();

		if (!image) {
			return new Response('Image not found', { status: 404 });
		}

		const imageBuffer = arrayBufferToBase64(image.image);
		return new Response(imageBuffer);
	};

	const getAllPhotos = async (): Promise<Response> => {
		const query = await env.DB.prepare('SELECT * FROM BikeTripsPhotos');
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

	const addPhoto = async (
		tripId: number,
		image: ArrayBuffer,
		isAdmin: boolean
	): Promise<Response> => {
		const query = await env.DB.prepare(
			'INSERT INTO BikeTripsPhotos (trip_id, public, image, created_at) VALUES (?1, ?2, ?3, ?4)'
		)
			.bind(tripId, isAdmin ? 1 : 0, image, Date.now())
			.run();

		return Response.json({ status: 'success' });
	};

	const deletePhoto = async (id: number): Promise<Response> => {
		const query = await env.DB.prepare('DELETE FROM BikeTripsPhotos WHERE id = ?').bind(id).run();

		return Response.json({ status: 'success' });
	};

	const publicBikeTrip = async (id: number): Promise<Response> => {
		const query = await env.DB.prepare('UPDATE BikeTrips SET public = 1 WHERE id = ?')
			.bind(id)
			.run();
		return Response.json({ status: 'success' });
	};

	const publicPhoto = async (id: number): Promise<Response> => {
		const query = await env.DB.prepare('UPDATE BikeTripsPhotos SET public = 1 WHERE id = ?')
			.bind(id)
			.run();
		return Response.json({ status: 'success' });
	};

	return {
		getAllBikeTrips,
		getBikeTrips,
		addBikeTrips,
		rateBikeTrips,
		addBikeTripsLocation,
		updateBikeTrips,
		deleteBikeTrips,
		getAllPhotos,
		getPhoto,
		addPhoto,
		deletePhoto,
		publicBikeTrip,
		publicPhoto,
	};
};

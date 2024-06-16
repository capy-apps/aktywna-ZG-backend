import { Router } from 'itty-router';
import { BikeTripsService } from '../../services/BikeTripsService';
import { BikeTripsRequest } from '../../types/BikeTrips';
import { isAdminRequest } from '../../utils/admin';

//router dla tras rowerowych
const bikeTripsRouter = Router({ base: '/map/bike-trips' });

//dodanie ścieżki do pobierania wszystkich tras rowerowych
bikeTripsRouter.get('/', async (request, env) => {
	const { getAllBikeTrips } = await BikeTripsService(env);
	const isAdmin = isAdminRequest(request, env);
	return await getAllBikeTrips(isAdmin);
});

//dodanie ścieżki do pobierania wszystkich zdjęć
bikeTripsRouter.get('/photos', async (request, env) => {
	const { getAllPhotos } = await BikeTripsService(env);
	const isAdmin = isAdminRequest(request, env);
	if (!isAdmin) return new Response('Unauthorized', { status: 401 });
	return await getAllPhotos();
});

//dodanie ścieżki do pobierania trasy rowerowej po id
bikeTripsRouter.get('/:id', async (request, env) => {
	const { getBikeTrips } = await BikeTripsService(env);
	return await getBikeTrips(Number(request.params.id));
});

//dodanie ścieżki do dodania trasy rowerowej
bikeTripsRouter.post('/', async (request, env) => {
	const body = (await request.json()) as BikeTripsRequest;
	const isAdmin = isAdminRequest(request, env);
	const { addBikeTrips } = await BikeTripsService(env);
	return await addBikeTrips(body, isAdmin);
});

//dodanie ścieżki do dodania lokalizacji trasy rowerowej
bikeTripsRouter.post('/gpx/:id', async (request, env) => {
	//pobranie pliku z formularza
	const file = await request.formData();
	const body = await file.get('file');
	const content = await body.text();
	//dodanie lokalizacji trasy rowerowej
	const { addBikeTripsLocation } = await BikeTripsService(env);
	return await addBikeTripsLocation(Number(request.params.id), content);
});

//dodanie ścieżki do oceniania trasy rowerowej
bikeTripsRouter.post('/rate/:id', async (request, env) => {
	const body = (await request.json()) as { rating: number };
	//sprawdzenie czy ocena jest poprawna
	if (body.rating < 1 || body.rating > 5) {
		return new Response('Rating must be between 1 and 5', { status: 400 });
	}
	//ocenienie trasy rowerowej
	const { rateBikeTrips } = await BikeTripsService(env);
	return await rateBikeTrips(Number(request.params.id), body.rating);
});

//dodanie ścieżki do aktualizacji trasy rowerowej
bikeTripsRouter.put('/:id', async (request, env) => {
	const body = (await request.json()) as BikeTripsRequest;
	const { updateBikeTrips } = await BikeTripsService(env);
	return await updateBikeTrips(Number(request.params.id), body);
});

//dodanie ścieżki do usuwania trasy rowerowej po id
bikeTripsRouter.delete('/:id', async (request, env) => {
	const { deleteBikeTrips } = await BikeTripsService(env);
	return await deleteBikeTrips(Number(request.params.id));
});

//dodanie ścieżki do pobierania zdjęcia po id
bikeTripsRouter.get('/photo/:id', async (request, env) => {
	const { getPhoto } = await BikeTripsService(env);
	return await getPhoto(Number(request.params.id));
});

//dodanie ścieżki do dodania zdjęcia
bikeTripsRouter.post('/photo/:id', async (request, env) => {
	const file = await request.formData();
	const body = await file.get('file');
	const content = await body.arrayBuffer();
	const isAdmin = isAdminRequest(request, env);
	const { addPhoto } = await BikeTripsService(env);
	return await addPhoto(Number(request.params.id), content, isAdmin);
});

//dodanie ścieżki do usuwania zdjęcia po id
bikeTripsRouter.delete('/photo/:id', async (request, env) => {
	const { deletePhoto } = await BikeTripsService(env);
	return await deletePhoto(Number(request.params.id));
});

//dodanie ścieżki do aktualizacji statusu trasy czy jest publiczne po id
bikeTripsRouter.put('/public/:id', async (request, env) => {
	const { publicBikeTrip } = await BikeTripsService(env);
	return await publicBikeTrip(Number(request.params.id));
});

//dodanie ścieżki do aktualizacji statusu zdjęcia czy jest publiczne po id
bikeTripsRouter.put('/photo/public/:id', async (request, env) => {
	const { publicPhoto } = await BikeTripsService(env);
	return await publicPhoto(Number(request.params.id));
});

//wyeksportowanie routera
export default bikeTripsRouter;

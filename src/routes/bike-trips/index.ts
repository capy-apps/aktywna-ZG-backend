import { Router } from 'itty-router';
import { mapService } from '../../services/map';
import { BikeTripsRequest } from '../../types/BikeTrips';

const bikeTripsRouter = Router({ base: '/map/bike-trips' });

bikeTripsRouter.get('/', async (request, env) => {
	const { getAllBikeTrips } = await mapService(env);
	return await getAllBikeTrips();
});

bikeTripsRouter.get('/:id', async (request, env) => {
  const { getBikeTrips } = await mapService(env);
  return await getBikeTrips(Number(request.params.id));
});

bikeTripsRouter.post('/', async (request, env) => {
	console.log(request.headers.get('Content-Type'));
	const body = (await request.json()) as BikeTripsRequest;
	const { addBikeTrips } = await mapService(env);
	return await addBikeTrips(body);
});

bikeTripsRouter.post('/gpx/:id', async (request, env) => {
	const file = await request.formData();
	const body = await file.get('file');
	const content = await body.text();
	const { addBikeTripsLocation } = await mapService(env);
  return await addBikeTripsLocation(Number(request.params.id), content);
});

export default bikeTripsRouter;

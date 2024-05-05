import { Router } from 'itty-router';
import { BikeTripsService } from '../../services/BikeTripsService';
import { BikeTripsRequest } from '../../types/BikeTrips';

const bikeTripsRouter = Router({ base: '/map/bike-trips' });

bikeTripsRouter.get('/', async (request, env) => {
	const { getAllBikeTrips } = await BikeTripsService(env);
	return await getAllBikeTrips();
});

bikeTripsRouter.get('/:id', async (request, env) => {
  const { getBikeTrips } = await BikeTripsService(env);
  return await getBikeTrips(Number(request.params.id));
});

bikeTripsRouter.post('/', async (request, env) => {
	console.log(request.headers.get('Content-Type'));
	const body = (await request.json()) as BikeTripsRequest;
	const { addBikeTrips } = await BikeTripsService(env);
	return await addBikeTrips(body);
});

bikeTripsRouter.post('/gpx/:id', async (request, env) => {
	const file = await request.formData();
	const body = await file.get('file');
	const content = await body.text();
	const { addBikeTripsLocation } = await BikeTripsService(env);
  return await addBikeTripsLocation(Number(request.params.id), content);
});

export default bikeTripsRouter;

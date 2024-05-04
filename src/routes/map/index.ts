import { Router } from 'itty-router';
import { mapService } from '../../services/map';
import { BikePathRequest } from '../../types/BikePath';

const mapRouter = Router({ base: '/map' });

mapRouter.get('/bike-paths', async (request, env) => {
	const { getAllBikePaths } = await mapService(env);
	return await getAllBikePaths();
});

mapRouter.get('/bike-paths/:id', async (request, env) => {
  const { getBikePath } = await mapService(env);
  return await getBikePath(Number(request.params.id));
});

mapRouter.post('/bike-paths', async (request, env) => {
	const body = (await request.json()) as BikePathRequest;
	const { addBikePath } = await mapService(env);
	return await addBikePath(body);
});

mapRouter.post('/bike-paths/gpx/:id', async (request, env) => {
	const file = await request.formData();
	const body = await file.get('file');
	const content = await body.text();
	const { addBikePathLocation } = await mapService(env);
  return await addBikePathLocation(Number(request.params.id), content);
});

export default mapRouter;

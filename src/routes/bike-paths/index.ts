import { Router } from 'itty-router';
import { BikePathsService } from '../../services/BikePathsService';
import { BikePathsRequest } from '../../types/BikePaths';

const bikePathsRouter = Router({ base: '/map/bike-paths' });

bikePathsRouter.get('/', async (request, env) => {
  const { getAllBikePaths } = await BikePathsService(env);
  return await getAllBikePaths();
});

bikePathsRouter.post('/', async (request, env) => {
  const body = (await request.json()) as BikePathsRequest;
  const { addBikePath } = await BikePathsService(env);
  return await addBikePath(body);
});

bikePathsRouter.post('/gpx/:id', async (request, env) => {
  const file = await request.formData();
  const body = await file.get('file');
  const content = await body.text();
  const { addBikePathLocation } = await BikePathsService(env);
  return await addBikePathLocation(Number(request.params.id), content);
});

export default bikePathsRouter;
import { Router } from 'itty-router';
import { BikePathsService } from '../../services/BikePathsService';
import { BikePathsRequest } from '../../types/BikePaths';

//router dla ścieżek rowerowych
const bikePathsRouter = Router({ base: '/map/bike-paths' });

//dodanie ścieżki do pobierania wszystkich ścieżek rowerowych
bikePathsRouter.get('/', async (request, env) => {
  const { getAllBikePaths } = await BikePathsService(env);
  return await getAllBikePaths();
});

//dodanie ścieżki do tworzenia ścieżki rowerowej
bikePathsRouter.post('/', async (request, env) => {
  const body = (await request.json()) as BikePathsRequest;
  const { addBikePath } = await BikePathsService(env);
  return await addBikePath(body);
});

//dodanie ścieżki do dodawania lokalizacji ścieżki rowerowej
bikePathsRouter.post('/gpx/:id', async (request, env) => {
  const file = await request.formData();
  const body = await file.get('file');
  const content = await body.text();
  const { addBikePathLocation } = await BikePathsService(env);
  return await addBikePathLocation(Number(request.params.id), content);
});

//dodanie ścieżki do aktualizowania ścieżki rowerowej po id
bikePathsRouter.put('/:id', async (request, env) => {
  const body = (await request.json()) as BikePathsRequest;
  const { updateBikePath } = await BikePathsService(env);
  return await updateBikePath(Number(request.params.id), body);
});

//dodanie ścieżki do usuwania ścieżki rowerowej pd id
bikePathsRouter.delete('/:id', async (request, env) => {
  const { deleteBikePath } = await BikePathsService(env);
  return await deleteBikePath(Number(request.params.id));
});

//wyeksportowanie routera
export default bikePathsRouter;
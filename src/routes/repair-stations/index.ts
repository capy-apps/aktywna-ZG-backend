import { Router } from "itty-router";
import { RepairStationsService } from "../../services/RepairStationsService";

//router dla stacji serwisowych
const repairStationsRouter = Router({ base: '/map/repair-stations' });

//dodanie ścieżki do pobierania wszystkich stacji serwisowych
repairStationsRouter.get('/', async (request, env) => {
  const { getAllRepairStations } = await RepairStationsService(env);
  return await getAllRepairStations();
});

//dodanie ścieżki do dodawania stacji serwisowej
repairStationsRouter.post('/', async (request, env) => {
  const body = (await request.json());
  const { addRepairStation } = await RepairStationsService(env);
  return await addRepairStation(body);
});

//dodanie ścieżki do aktualizacji stacji serwisowej
repairStationsRouter.put('/:id', async (request, env) => {
  const body = (await request.json());
  const { updateRepairStation } = await RepairStationsService(env);
  return await updateRepairStation(Number(request.params.id), body);
});

//dodanie ścieżki do usuwania stacji serwisowej
repairStationsRouter.delete('/:id', async (request, env) => {
  const { deleteRepairStation } = await RepairStationsService(env);
  return await deleteRepairStation(Number(request.params.id));
});

//wyeksportowanie routera
export default repairStationsRouter;

import { Router } from "itty-router";
import { RepairStationsService } from "../../services/RepairStationsService";

const repairStationsRouter = Router({ base: '/map/repair-stations' });

repairStationsRouter.get('/', async (request, env) => {
  const { getAllRepairStations } = await RepairStationsService(env);
  return await getAllRepairStations();
});

repairStationsRouter.post('/', async (request, env) => {
  const body = (await request.json());
  const { addRepairStation } = await RepairStationsService(env);
  return await addRepairStation(body);
});

repairStationsRouter.put('/:id', async (request, env) => {
  const body = (await request.json());
  const { updateRepairStation } = await RepairStationsService(env);
  return await updateRepairStation(Number(request.params.id), body);
});

repairStationsRouter.delete('/:id', async (request, env) => {
  const { deleteRepairStation } = await RepairStationsService(env);
  return await deleteRepairStation(Number(request.params.id));
});

export default repairStationsRouter;

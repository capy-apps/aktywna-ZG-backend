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

export default repairStationsRouter;

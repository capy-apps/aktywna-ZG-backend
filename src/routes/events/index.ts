import { Router } from "itty-router";
import { EventService } from "../../services/EventService";

const eventsRouter = Router({ base: '/events' });

eventsRouter.get('/', async (request, env) => {
  const { getAllEvents } = await EventService(env);
  return await getAllEvents();
});

eventsRouter.post('/', async (request, env) => {
  const body = (await request.json());
  const { addEvent } = await EventService(env);
  return await addEvent(body);
});

export default eventsRouter;
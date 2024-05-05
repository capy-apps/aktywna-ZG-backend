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

eventsRouter.put('/:id', async (request, env) => {
  const body = (await request.json());
  const { updateEvent } = await EventService(env);
  return await updateEvent(Number(request.params.id), body);
});

eventsRouter.delete('/:id', async (request, env) => {
  const { deleteEvent } = await EventService(env);
  return await deleteEvent(Number(request.params.id));
});

export default eventsRouter;
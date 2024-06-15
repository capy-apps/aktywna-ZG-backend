import { Router } from "itty-router";
import { EventService } from "../../services/EventService";
import { EventRequest } from "../../types/Event";

const eventsRouter = Router({ base: '/events' });

eventsRouter.get('/', async (request, env) => {
  const { getAllEvents } = await EventService(env);
  return await getAllEvents();
});

eventsRouter.post('/', async (request, env) => {
  const data = await request.formData();
	const file = await data.get('file');
  const name = await data.get('name');
  const description = await data.get('description');
  const date = await data.get('date');
  const body: EventRequest = {
    name: name,
    description: description,
    date: date,
  };

  const { addEvent } = await EventService(env);

	const arrayBuffer = await file.arrayBuffer();
  return await addEvent(body, arrayBuffer);
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

eventsRouter.get('/user/:uuid', async (request, env) => {
  const { getUserEvents } = await EventService(env);
  return await getUserEvents(request.params.uuid);
});

eventsRouter.post('/participant/:id', async (request, env) => {
  const { addEventParticipant } = await EventService(env);
  const body = (await request.json());
  const uuid = body.uuid;
  return await addEventParticipant(Number(request.params.id), uuid);
});

export default eventsRouter;
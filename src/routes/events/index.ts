import { Router } from "itty-router";
import { EventService } from "../../services/EventService";
import { EventRequest } from "../../types/Event";

//router dla wydarzeń
const eventsRouter = Router({ base: '/events' });

//dodanie ścieżki do pobierania wszystkich wydarzeń
eventsRouter.get('/', async (request, env) => {
  const { getAllEvents } = await EventService(env);
  return await getAllEvents();
});

//dodanie ścieżki do dodania wydarzenia
eventsRouter.post('/', async (request, env) => {
  //pobranie danych z formularza
  const data = await request.formData();
	const file = await data.get('file');
  const name = await data.get('name');
  const description = await data.get('description');
  const date = await data.get('date');
  //utworzenie ciała zapytania
  const body: EventRequest = {
    name: name,
    description: description,
    date: date,
  };

  //dodanie wydarzenia
  const { addEvent } = await EventService(env);
  
  const arrayBuffer = await file.arrayBuffer();
  return await addEvent(body, arrayBuffer);
});

//dodanie ścieżki do aktualizacji wydarzenia
eventsRouter.put('/:id', async (request, env) => {
  const body = (await request.json());
  const { updateEvent } = await EventService(env);
  return await updateEvent(Number(request.params.id), body);
});

//dodanie ścieżki do usuwania wydarzenia
eventsRouter.delete('/:id', async (request, env) => {
  const { deleteEvent } = await EventService(env);
  return await deleteEvent(Number(request.params.id));
});

//dodanie ścieżki do pobierania wydarzeń użytkownika
eventsRouter.get('/user/:uuid', async (request, env) => {
  const { getUserEvents } = await EventService(env);
  return await getUserEvents(request.params.uuid);
});

//dodanie ścieżki do dodania uczestnika do wydarzenia
eventsRouter.post('/participant/:id', async (request, env) => {
  const { addEventParticipant } = await EventService(env);
  const body = (await request.json());
  const uuid = body.uuid;
  return await addEventParticipant(Number(request.params.id), uuid);
});

export default eventsRouter;
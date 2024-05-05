import { Env } from '../types';
import { Event, EventRequest } from '../types/Event';

export const EventService = async (env: Env) => {
	const getAllEvents = async (): Promise<Response> => {
		const query = env.DB.prepare('SELECT * FROM Events');
		const { results } = await query.all<Event>();
		return Response.json(results);
	};

	const addEvent = async (event: EventRequest): Promise<Response> => {
		const query = await env.DB.prepare(
			'INSERT INTO Events (name, description, image, date, created_at) VALUES (?1, ?2, ?3, ?4, ?5)'
		)
			.bind(event.name, event.description, event.image, event.date, Date.now())
			.run();

		return Response.json({
			id: query.meta.last_row_id,
			...event,
			created_at: Date.now(),
		});
	};

	const updateEvent = async (id: number, event: EventRequest): Promise<Response> => {
		const query = await env.DB.prepare(
			'UPDATE Events SET name = ?1, description = ?2, image = ?3, date = ?4 WHERE id = ?5'
		)
			.bind(event.name, event.description, event.image, event.date, id)
			.run();

		return Response.json({
			id,
			...event,
		});
	};

	const deleteEvent = async (id: number): Promise<Response> => {
		const query = await env.DB.prepare('DELETE FROM Events WHERE id = ?1').bind(id).run();
		return Response.json({ status: 'success' });
	};

	return {
		getAllEvents,
		addEvent,
		updateEvent,
		deleteEvent,
	};
};

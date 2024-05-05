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
			'INSERT INTO Events (name, description, image, created_at) VALUES (?1, ?2, ?3, ?4)'
		)
			.bind(event.name, event.description, event.image, Date.now())
			.run();

		return Response.json({
			id: query.meta.last_row_id,
			...event,
			created_at: Date.now(),
		});
	};

	return {
		getAllEvents,
		addEvent,
	};
};

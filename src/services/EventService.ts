import { Env } from '../types';
import { Event, EventRequest } from '../types/Event';
import { arrayBufferToBase64 } from '../utils/buffer';

export const EventService = async (env: Env) => {
	const getAllEvents = async (): Promise<Response> => {
		const query = env.DB.prepare('SELECT * FROM Events');
		const { results } = await query.all<Event>();

		const events = results.map(event => {
			return {
				...event,
				image: arrayBufferToBase64(event.image),
			};
		});
		return Response.json(events);
	};

	const addEvent = async (event: EventRequest, image: ArrayBuffer): Promise<Response> => {
		const query = await env.DB.prepare(
			'INSERT INTO Events (name, description, image, date, created_at) VALUES (?1, ?2, ?3, ?4, ?5)'
		)
			.bind(event.name, event.description, image, event.date, Date.now())
			.run();

		return Response.json({
			id: query.meta.last_row_id,
			...event,
			created_at: Date.now(),
		});
	};

	const updateEvent = async (id: number, event: EventRequest): Promise<Response> => {
		const query = await env.DB.prepare(
			'UPDATE Events SET name = ?1, description = ?2, date = ?3 WHERE id = ?4'
		)
			.bind(event.name, event.description, event.date, id)
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

	const getUserEvents = async (userUuid: string): Promise<Response> => {
		const query = env.DB.prepare(
			'SELECT * FROM Events WHERE id IN (SELECT event_id FROM EventParticipants WHERE user_uuid = ?)'
		).bind(userUuid);
		const { results } = await query.all<Event>();
		return Response.json(
			results.map(event => {
				return {
					...event,
					image: arrayBufferToBase64(event.image),
				};
			}),
		);
	};

	const addEventParticipant = async (eventId: number, userUuid: string): Promise<Response> => {
		const query = await env.DB.prepare(
			'INSERT INTO EventParticipants (event_id, user_uuid) VALUES (?1, ?2)'
		)
			.bind(eventId, userUuid)
			.run();

		return Response.json({ status: 'success' });
	};

	return {
		getAllEvents,
		addEvent,
		updateEvent,
		deleteEvent,
		getUserEvents,
		addEventParticipant,
	};
};

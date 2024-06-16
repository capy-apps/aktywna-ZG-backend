import { Env } from '../types';
import { Event, EventRequest } from '../types/Event';
import { arrayBufferToBase64 } from '../utils/buffer';

//Serwis obsługujący wydarzenia
export const EventService = async (env: Env) => {
	//funkcja zwracająca odpowiedź ze wszystkimi wydarzeniami
	const getAllEvents = async (): Promise<Response> => {
		//zapytanie do bazy danych zwracające wszystkie wydarzenia
		const query = env.DB.prepare('SELECT * FROM Events');
		const { results } = await query.all<Event>();

		//przypisanie wyników zapytania do zmiennej events i wysłanie odpowiedzi z przetworzonymi zdjęciami
		const events = results.map(event => {
			return {
				...event,
				image: arrayBufferToBase64(event.image),
			};
		});
		return Response.json(events);
	};

	//funkcja dodająca wydarzenie
	const addEvent = async (event: EventRequest, image: ArrayBuffer): Promise<Response> => {
		//dodanie wydarzenia do bazy danych
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

	//funkcja aktualizująca wydarzenie
	const updateEvent = async (id: number, event: EventRequest): Promise<Response> => {
		//aktualizacja wydarzenia w bazie danych
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

	//funkcja usuwająca wydarzenie
	const deleteEvent = async (id: number): Promise<Response> => {
		//usunięcie wydarzenia z bazy danych
		const query = await env.DB.prepare('DELETE FROM Events WHERE id = ?1').bind(id).run();
		return Response.json({ status: 'success' });
	};

	//funkcja zwracająca odpowiedź z wydarzeniami użytkownika
	const getUserEvents = async (userUuid: string): Promise<Response> => {
		//zapytanie do bazy danych zwracające wydarzenia użytkownika
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

	//funkcja dodająca uczestnika do wydarzenia
	const addEventParticipant = async (eventId: number, userUuid: string): Promise<Response> => {
		//dodanie uczestnika do wydarzenia w bazie danych
		const query = await env.DB.prepare(
			'INSERT INTO EventParticipants (event_id, user_uuid) VALUES (?1, ?2)'
		)
			.bind(eventId, userUuid)
			.run();

		return Response.json({ status: 'success' });
	};

	//zwrócenie funkcji obsługujących wydarzenia
	return {
		getAllEvents,
		addEvent,
		updateEvent,
		deleteEvent,
		getUserEvents,
		addEventParticipant,
	};
};

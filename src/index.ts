import router from './routes';
import { Env } from './types';
import { authenicated } from './utils/admin';
import { addCorsHeaders, handleOptionsRequest } from './utils/cors';

/**
 * Entry point do przetwarzania zapytań aplikacji.
 * @param {Request} request - Zapytanie do przetworzenia.
 * @param {Env} env - Obiekt zawierający zmienne środowiskowe.
 * @param {ExecutionContext} ctx - Kontekst wykonania.
 * @returns {Promise<Response>} Odpowiedź na zapytanie.
 * 
 */
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === "OPTIONS") {
			// Obsługa cors
			return handleOptionsRequest(request);
		}
		// Sprawdzenie czy użytkownik jest autoryzowany
		if(!authenicated(request, env)) {
			return new Response('Unauthorized', { status: 401 });
		}
		// Przekazanie zapytania do routera
		const response = await router.handle(request, env, ctx);
		return addCorsHeaders(response);
	},
};
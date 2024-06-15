import router from './routes';
import { Env } from './types';
import { authenicated } from './utils/admin';
import { addCorsHeaders, handleOptionsRequest } from './utils/cors';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === "OPTIONS") {
			// Handle CORS preflight requests
			return handleOptionsRequest(request);
		}
		if(!authenicated(request, env)) {
			return new Response('Unauthorized', { status: 401 });
		}
		
		const response = await router.handle(request, env, ctx);
		return addCorsHeaders(response);
	},
};
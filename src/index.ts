import router from './routes';
import { Env } from './types';
import { authenicated } from './utils/admin';
import { addCorsHeaders } from './utils/cors';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if(!authenicated(request, env)) {
			return new Response('Unauthorized', { status: 401 });
		}
		
		const response = await router.handle(request, env, ctx);
		return addCorsHeaders(response);
	},
};

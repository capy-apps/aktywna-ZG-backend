import router from './routes';
import { Env } from './types';
import { addCorsHeaders } from './utils/cors';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const response = await router.handle(request, env, ctx);
		return addCorsHeaders(response);
	},
};

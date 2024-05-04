import { Env } from '../types';

export const authenicated = (request: Request, env: Env): boolean => {
	if (request.method !== 'POST') return true;

	const secret = env.ADMIN_SECRET;
	const header = request.headers.get('Authorization');
	return header === secret;
};

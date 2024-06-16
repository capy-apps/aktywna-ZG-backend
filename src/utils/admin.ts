import { IRequest } from 'itty-router';
import { Env } from '../types';


// Sprawdzenie czy zapytanie jest autoryzowane do wykonania przez administratora
export const authenicated = (request: Request, env: Env): boolean => {
	if (request.method === 'GET') return true;
	if (request.url.includes('bike-trips') && request.method === 'POST') return true;

	const secret = env.ADMIN_SECRET;
	const header = request.headers.get('Authorization');
	return header === secret;
};

//Sprawdzenie czy zapytanie jest stworzone przez administratora
export const isAdminRequest = (request: IRequest, env: Env): boolean => {
	const secret = env.ADMIN_SECRET;
	const header = request.headers.get('Authorization');
	return header === secret;
}
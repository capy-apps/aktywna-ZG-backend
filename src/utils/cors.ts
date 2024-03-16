
export const addCorsHeaders = (response: Response): Response => {
	const headers = new Headers(response.headers);

	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('access-control-expose-headers', '*');
	headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
	headers.set('Cache-Control', 'max-age=3600');

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: headers,
	});
};
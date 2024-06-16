
export const addCorsHeaders = (response: Response): Response => {
	const headers = new Headers(response.headers);

	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('access-control-expose-headers', '*');
	headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, DELETE');
	headers.set('Cache-Control', 'max-age=3600');

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: headers,
	});
};

export const handleOptionsRequest = (request: Request): Response => {
	const headers = new Headers();

	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, DELETE');
	headers.set('Access-Control-Max-Age', '86400');

	const accessControlRequestHeaders = request.headers.get('Access-Control-Request-Headers');
	if (accessControlRequestHeaders) {
		headers.set('Access-Control-Allow-Headers', accessControlRequestHeaders);
	}

	return new Response(null, {
		headers,
	});
}
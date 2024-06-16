import { Router } from "itty-router";
import { isAdminRequest } from "../../utils/admin";

const adminRouter = Router({ base: '/admin' });

adminRouter.get('/', async (request, env) => {
	const isAdmin = isAdminRequest(request, env)
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response('OK', { status: 200 });
});

export default adminRouter;
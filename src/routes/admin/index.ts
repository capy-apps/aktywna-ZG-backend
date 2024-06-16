import { Router } from "itty-router";
import { isAdminRequest } from "../../utils/admin";

//router dla admina
const adminRouter = Router({ base: '/admin' });

//dodanie ścieżki do sprawdzenia czy użytkownik jest adminem
adminRouter.get('/', async (request, env) => {
	const isAdmin = isAdminRequest(request, env)
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response('OK', { status: 200 });
});

//wyeksportowanie routera
export default adminRouter;
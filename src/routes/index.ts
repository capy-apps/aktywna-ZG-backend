import { Router } from 'itty-router';
import mapRouter from './map';

const router = Router({ base: '/' });

router.all('/map/*', mapRouter.handle);

router.all('*', () => new Response("Hello from the root router!"));

export default router;
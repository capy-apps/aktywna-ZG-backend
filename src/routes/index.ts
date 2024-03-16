import { Router } from 'itty-router';
import testRouter from './test';

const router = Router({ base: '/' });

router.all('/test/*', testRouter.handle);

router.all('*', () => new Response("Hello from the root router!"));

export default router;
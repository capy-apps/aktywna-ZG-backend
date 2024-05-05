import { Router } from 'itty-router';
import bikeTripsRouter from './bike-trips';
import bikePathsRouter from './bike-paths';

const router = Router({ base: '/' });

router.all('/map/*', bikeTripsRouter.handle);
router.all('/map/*', bikePathsRouter.handle);

router.all('*', () => new Response("Hello from the root router!"));

export default router;
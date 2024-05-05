import { Router } from 'itty-router';
import bikeTripsRouter from './bike-trips';

const router = Router({ base: '/' });

router.all('/map/*', bikeTripsRouter.handle);

router.all('*', () => new Response("Hello from the root router!"));

export default router;
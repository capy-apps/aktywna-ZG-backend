import { Router } from 'itty-router';
import bikeTripsRouter from './bike-trips';
import bikePathsRouter from './bike-paths';
import repairStationsRouter from './repair-stations';

const router = Router({ base: '/' });

router.all('/map/bike-trips/*', bikeTripsRouter.handle);
router.all('/map/bike-paths/*', bikePathsRouter.handle);
router.all('/map/repair-stations/*', repairStationsRouter.handle);

router.all('*', () => new Response("Hello from the root router!"));

export default router;
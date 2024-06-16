import { Router } from 'itty-router';
import bikeTripsRouter from './bike-trips';
import bikePathsRouter from './bike-paths';
import repairStationsRouter from './repair-stations';
import eventsRouter from './events';
import adminRouter from './admin';

const router = Router({ base: '/' });

router.all('/map/bike-trips/*', bikeTripsRouter.handle);
router.all('/map/bike-paths/*', bikePathsRouter.handle);
router.all('/map/repair-stations/*', repairStationsRouter.handle);

router.all('/events/*', eventsRouter.handle);

router.all('/admin/*', adminRouter.handle);

router.all('*', () => new Response("Hello from the root router!"));

export default router;
import { Router } from 'itty-router';
import bikeTripsRouter from './bike-trips';
import bikePathsRouter from './bike-paths';
import repairStationsRouter from './repair-stations';
import eventsRouter from './events';
import adminRouter from './admin';

//utworzenie routera dla ścieżki głównej
const router = Router({ base: '/' });

//dodanie sciezek tras rowerowych, sciezek rowerowych, stacji serwisowych, wydarzeń i panelu administracyjnego do routera
router.all('/map/bike-trips/*', bikeTripsRouter.handle);
router.all('/map/bike-paths/*', bikePathsRouter.handle);
router.all('/map/repair-stations/*', repairStationsRouter.handle);

router.all('/events/*', eventsRouter.handle);

router.all('/admin/*', adminRouter.handle);

//dodanie odpowiedzi dla ścieżki głównej
router.all('*', () => new Response("Hello from the root router!"));

//wyeksportowanie routera
export default router;
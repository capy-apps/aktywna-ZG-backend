import { Router } from 'itty-router';

const testRouter = Router({ base: '/test' });

testRouter.all('*', () => new Response('Test endpoint'));

export default testRouter;
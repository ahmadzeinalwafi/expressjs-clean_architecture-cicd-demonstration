import express from 'express';
import createAuthMiddleware from '../../middleware/authMiddleware.js';

const createThreadsRouter = (handler, container) => {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(container);

  router.post('/', authMiddleware, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadByIdHandler);

  return router;
};

export default createThreadsRouter;


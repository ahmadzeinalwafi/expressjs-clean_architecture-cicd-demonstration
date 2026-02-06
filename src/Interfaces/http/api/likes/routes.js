import express from 'express';
import createAuthMiddleware from '../../middleware/authMiddleware.js';

const createLikesRouter = (handler, container) => {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(container);

  router.put('/:threadId/comments/:commentId/likes', authMiddleware, handler.putLikeCommentHandler);

  return router;
};

export default createLikesRouter;

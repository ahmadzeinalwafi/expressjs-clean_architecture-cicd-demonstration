import express from 'express';
import createAuthMiddleware from '../../middleware/authMiddleware.js';

const createCommentsRouter = (handler, container) => {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(container);

  router.post('/:threadId/comments', authMiddleware, handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authMiddleware, handler.deleteCommentHandler);

  return router;
};

export default createCommentsRouter;

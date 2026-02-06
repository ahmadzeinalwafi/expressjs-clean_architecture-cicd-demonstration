import express from 'express';
import createAuthMiddleware from '../../middleware/authMiddleware.js';

const createRepliesRouter = (handler, container) => {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(container);

  router.post('/:threadId/comments/:commentId/replies', authMiddleware, handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authMiddleware, handler.deleteReplyHandler);

  return router;
};

export default createRepliesRouter;

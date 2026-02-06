import CommentsHandler from './handler.js';
import createCommentsRouter from './routes.js';

const comments = (container) => {
  const handler = new CommentsHandler(container);
  return createCommentsRouter(handler, container);
};

export default comments;

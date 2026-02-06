import LikesHandler from './handler.js';
import createLikesRouter from './routes.js';

export default (container) => {
  const handler = new LikesHandler(container);
  return createLikesRouter(handler, container);
};

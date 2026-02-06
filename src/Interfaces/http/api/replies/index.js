import RepliesHandler from './handler.js';
import createRepliesRouter from './routes.js';

const replies = (container) => {
  const handler = new RepliesHandler(container);
  return createRepliesRouter(handler, container);
};

export default replies;

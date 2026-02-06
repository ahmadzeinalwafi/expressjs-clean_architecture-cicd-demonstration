import ThreadsHandler from './handler.js';
import createThreadsRouter from './routes.js';

const threads = (container) => {
  const handler = new ThreadsHandler(container);
  return createThreadsRouter(handler, container);
};

export default threads;

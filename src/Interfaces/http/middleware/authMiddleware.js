import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

const createAuthMiddleware = (container) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authHeader.split(' ')[1];
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);

      await authTokenManager.verifyAccessToken(token);
      const payload = await authTokenManager.decodePayload(token);

      req.auth = {
        id: payload.id,
        username: payload.username,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default createAuthMiddleware;

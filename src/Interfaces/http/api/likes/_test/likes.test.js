import request from 'supertest';
import pool from '../../../../../Infrastructures/database/postgres/pool.js';
import UsersTableTestHelper from '../../../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../../../tests/CommentsTableTestHelper.js';
import container from '../../../../../Infrastructures/container.js';
import createServer from '../../../../../Infrastructures/http/createServer.js';
import AuthenticationTokenManager from '../../../../../Applications/security/AuthenticationTokenManager.js';

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.query('DELETE FROM likes WHERE 1=1');
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when like comment properly', async () => {
      // Arrange
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding', id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 200 when unlike comment properly', async () => {
      // Arrange
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding', id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      const app = await createServer(container);

      // Add like first
      await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Action (Unlike)
      const response = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 401 when request without access token', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes');

      // Assert
      expect(response.status).toEqual(401);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding', id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put('/threads/thread-404/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding', id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put(`/threads/${threadId}/comments/comment-404/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
    });
  });
});

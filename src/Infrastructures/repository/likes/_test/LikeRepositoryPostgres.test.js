
import LikeRepositoryPostgres from '../LikeRepositoryPostgres.js';
import pool from '../../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../../tests/CommentsTableTestHelper.js';

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.query('DELETE FROM likes WHERE 1=1');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist new like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike('user-123', 'comment-123');

      // Assert
      const result = await pool.query("SELECT * FROM likes WHERE id = 'like-123'");
      expect(result.rowCount).toEqual(1);
    });
  });

  describe('checkLikeStatus function', () => {
    it('should return true if like exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await likeRepositoryPostgres.addLike('user-123', 'comment-123');

      // Action
      const status = await likeRepositoryPostgres.checkLikeStatus('user-123', 'comment-123');

      // Assert
      expect(status).toEqual(true);
    });

    it('should return false if like does not exist', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const status = await likeRepositoryPostgres.checkLikeStatus('user-123', 'comment-123');

      // Assert
      expect(status).toEqual(false);
    });
  });

  describe('deleteLike function', () => {
    it('should remove like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await likeRepositoryPostgres.addLike('user-123', 'comment-123');

      // Action
      await likeRepositoryPostgres.deleteLike('user-123', 'comment-123');

      // Assert
      const status = await likeRepositoryPostgres.checkLikeStatus('user-123', 'comment-123');
      expect(status).toEqual(false);
    });
  });
});

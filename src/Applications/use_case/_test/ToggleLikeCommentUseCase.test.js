import { vi } from 'vitest';
import ToggleLikeCommentUseCase from '../ToggleLikeCommentUseCase.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrating the add like action correctly when not liked yet', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeStatus = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkLikeStatus).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });

  it('should orchestrating the delete like action correctly when already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeStatus = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkLikeStatus).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});

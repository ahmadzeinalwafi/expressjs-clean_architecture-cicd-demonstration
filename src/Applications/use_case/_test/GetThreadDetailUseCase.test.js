import { vi } from 'vitest';
/* eslint-disable camelcase */
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'a second comment',
        is_deleted: true,
        like_count: '0',
      },
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'a comment',
        is_deleted: false,
        like_count: '0',
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2021-08-08T07:30:00.000Z',
        content: 'a reply',
        is_deleted: false,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-456');
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');

    expect(threadDetail).toStrictEqual(new ThreadDetail({
      id: 'thread-123',
      title: 'a thread',
      body: 'a body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          replies: [
            {
              id: 'reply-123',
              content: 'a reply',
              date: '2021-08-08T07:30:00.000Z',
              username: 'dicoding',
            },
          ],
          content: '**komentar telah dihapus**',
          likeCount: 0,
        },
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          replies: [
            {
              id: 'reply-123',
              content: 'a reply',
              date: '2021-08-08T07:30:00.000Z',
              username: 'dicoding',
            },
          ],
          content: 'a comment',
          likeCount: 0,
        },
      ],
    }));
  });
});


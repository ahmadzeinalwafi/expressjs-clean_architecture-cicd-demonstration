import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    // Map comments with their replies
    const mappedComments = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

        const mappedReplies = replies.map((reply) => ({
          id: reply.id,
          content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        }));

        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          replies: mappedReplies,
          content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
          likeCount: parseInt(comment.like_count, 10),
        };
      })
    );

    return new ThreadDetail({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: mappedComments,
    });
  }
}

export default GetThreadDetailUseCase;


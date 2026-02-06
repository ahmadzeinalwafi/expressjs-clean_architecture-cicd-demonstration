import ToggleLikeCommentUseCase from '../../../../Applications/use_case/ToggleLikeCommentUseCase.js';

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeCommentHandler(req, res, next) {
    try {
      const toggleLikeCommentUseCase = this._container.getInstance(ToggleLikeCommentUseCase.name);
      await toggleLikeCommentUseCase.execute({
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        userId: req.auth.id,
      });

      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikesHandler;

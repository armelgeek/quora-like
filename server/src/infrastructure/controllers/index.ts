import { AnswerController } from './answer.controller'
import { CommentController } from './comment.controller'
import { FollowController } from './follow.controller'
import { PollController } from './poll.controller'
import { QuestionController } from './question.controller'
import { TopicController } from './topic.controller'
import { VoteController } from './vote.controller'
export const controllers = [
  new AnswerController(),
  new CommentController(),
  new FollowController(),
  new QuestionController(),
  new TopicController(),
  new VoteController(),
  new PollController()
]

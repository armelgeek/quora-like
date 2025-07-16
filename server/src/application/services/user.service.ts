import { UserRepository } from '../../infrastructure/repositories/user.repository'
import { GetUserByIdUseCase } from '../use-cases/user'

export class UserService {
  private readonly getUserByIdUseCase: GetUserByIdUseCase
  private readonly userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
    this.getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository)
  }

  getUserById = (userId: string) => {
    return this.getUserByIdUseCase.execute(userId)
  }
}

import { App } from './app'
import { BlogController, UserController } from './infrastructure/controllers'

const app = new App([new UserController(), new BlogController()]).getApp()
export default app

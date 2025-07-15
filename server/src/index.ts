import { App } from './app'
import { UserController } from './infrastructure/controllers'

const app = new App([new UserController()]).getApp()
export default app

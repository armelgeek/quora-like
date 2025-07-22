import process from 'node:process'
import { App } from './app'
import { controllers } from './infrastructure/controllers'
import { PermissionController } from './infrastructure/controllers/permission.controller'
import { UserController } from './infrastructure/controllers/user.controller'
const app = new App([new UserController(), new PermissionController(), ...controllers]).getApp()

const port = Number(process.env.PORT) || 3000

console.info(`🚀 Server is running on port ${port}`)
console.info(`📚 API Documentation: http://localhost:${port}/docs`)
console.info(`🔍 OpenAPI Schema: http://localhost:${port}/swagger`)

export default {
  port,
  fetch: app.fetch
}

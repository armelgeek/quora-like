import process from 'node:process'
import { App } from './app'
import { PermissionController, UserController } from './infrastructure/controllers'

const app = new App([
  new UserController(),
  new PermissionController(),
]).getApp()

const port = Number(process.env.PORT) || 3000

console.info(`🚀 Server is running on port ${port}`)
console.info(`📚 API Documentation: http://localhost:${port}/docs`)
console.info(`🔍 OpenAPI Schema: http://localhost:${port}/swagger`)

export default {
  port,
  fetch: app.fetch
}

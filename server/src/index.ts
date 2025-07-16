import process from 'node:process'
import { App } from './app'
import { BlogController, PermissionController, UserController } from './infrastructure/controllers'
import { CategoryController } from './infrastructure/controllers/category.controller'

const app = new App([
  new UserController(),
  new PermissionController(),
  new BlogController(),
  new CategoryController()
]).getApp()

const port = Number(process.env.PORT) || 3000

console.info(`🚀 Server is running on port ${port}`)
console.info(`📚 API Documentation: http://localhost:${port}/docs`)
console.info(`🔍 OpenAPI Schema: http://localhost:${port}/swagger`)

export default {
  port,
  fetch: app.fetch
}

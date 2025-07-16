import process from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import 'dotenv/config'

const main = async () => {
  const connectionString = process.env.DATABASE_URL!

  // for migrations
  const migrationClient = postgres(connectionString, { max: 1 })
  const db = drizzle(migrationClient)

  console.info('⏳ Running migrations...')

  await migrate(db, { migrationsFolder: './drizzle' })

  console.info('✅ Migrations completed!')

  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Migration failed!')
  console.error(error)
  process.exit(1)
})

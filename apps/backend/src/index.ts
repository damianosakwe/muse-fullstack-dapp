import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { requestContext } from '@/middleware/requestContext'
import { requestLogger } from '@/middleware/requestLogger'
import { errorHandler } from '@/middleware/errorHandler'
import { notFoundHandler } from '@/middleware/notFound'
import { createLogger } from '@/utils/logger'
import databaseService from '@/services/databaseService'
import { jobQueueService } from '@/services/jobQueueService'

// Route imports
import authRoutes from '@/routes/auth'
import artworkRoutes from '@/routes/artwork'
import userRoutes from '@/routes/user'
import aiRoutes from '@/routes/ai'
import metadataRoutes from '@/routes/metadata'
import cacheRoutes from '@/routes/cache'
import cacheManagementRoutes from '@/routes/cacheManagement'
import imageOptimizerRoutes from '@/routes/imageOptimizer'
import favoriteRoutes from '@/routes/favorites'
import apiKeyRoutes from '@/routes/apiKeys'
import jobRoutes from '@/routes/jobs'

const logger = createLogger('App')
const PORT = parseInt(process.env.PORT || '3001', 10)

const app = express()

// ── Security & Parsing Middleware ────────────────────────────────────────────
app.use(helmet())

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  : ['*']

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      return callback(null, true)
    }
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Request Tracing ──────────────────────────────────────────────────────────
app.use(requestContext)

// ── HTTP Logging ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger)
}

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  })
})

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/artworks', artworkRoutes)
app.use('/api/users', userRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/metadata', metadataRoutes)
app.use('/api/cache', cacheRoutes)
app.use('/api/cache', cacheManagementRoutes)
app.use('/api/images', imageOptimizerRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/keys', apiKeyRoutes)
app.use('/api/jobs', jobRoutes)

// ── 404 & Global Error Handlers ──────────────────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

// ── Graceful Startup ─────────────────────────────────────────────────────────
async function start() {
  try {
    await databaseService.connect()
    logger.info('Database connected successfully')

    try {
      await jobQueueService.initialize()
      logger.info('Job queue service initialized')
    } catch (error) {
      logger.error('Failed to initialize job queue service:', { error })
    }

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, { port: PORT, env: process.env.NODE_ENV })
    })

    // ── Graceful Shutdown ──────────────────────────────────────────────────
    const shutdown = async (signal: string) => {
      logger.warn(`Received ${signal} — shutting down gracefully`)
      server.close(async () => {
        try {
          await jobQueueService.shutdown()
          await databaseService.disconnect()
          logger.info('Database disconnected. Server closed.')
          process.exit(0)
        } catch (err) {
          logger.error('Error during shutdown', { error: err })
          process.exit(1)
        }
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

  } catch (err) {
    logger.error('Failed to start server', { error: err })
    process.exit(1)
  }
}

start()

export default app

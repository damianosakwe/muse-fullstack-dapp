import { Router } from 'express'
import {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getArtworksByCreator,
  getArtworksByOwner
} from '@/controllers/artworkController'
import { artworkCache } from '@/middleware/cacheMiddleware'

const router = Router()

// Public routes
router.get('/', artworkCache, getArtworks)
router.get('/creator/:creator', artworkCache, getArtworksByCreator)
router.get('/owner/:owner', artworkCache, getArtworksByOwner)
router.get('/:id', artworkCache, getArtworkById)

// Protected routes (would need authentication middleware)
router.post('/', createArtwork)
router.put('/:id', updateArtwork)
router.delete('/:id', deleteArtwork)

export default router
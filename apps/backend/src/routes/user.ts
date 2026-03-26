import { Router } from 'express'
import { 
  getUserProfile, 
  updateUserProfile, 
  createUserProfile, 
  getUserStats, 
  searchUsers 
} from '@/controllers/userController'
import { userProfileCache } from '@/middleware/cacheMiddleware'

const router = Router()

// Public routes
router.get('/profile', userProfileCache, getUserProfile)
router.get('/stats/:publicKey', userProfileCache, getUserStats)
router.get('/search', userProfileCache, searchUsers)

// Protected routes (would need authentication middleware)
router.post('/profile', createUserProfile)
router.put('/profile', updateUserProfile)

export default router

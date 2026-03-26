import { Request, Response, NextFunction } from 'express'
import { createError } from '@/middleware/errorHandler'
import { invalidateUserCache } from '@/middleware/cacheMiddleware'
import { createLogger } from '@/utils/logger'
import { User, IUser } from '@/models'

const logger = createLogger('UserController')

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicKey } = req.query
    
    if (!publicKey) {
      const err = createError('Public key is required', 400)
      return next(err)
    }

    const user = await User.findOne({ publicKey })
      .lean()

    if (!user) {
      // Return a default profile for new users
      const defaultUser = {
        publicKey: publicKey as string,
        username: undefined,
        bio: undefined,
        avatar: undefined,
        stats: {
          artworksCreated: 0,
          artworksOwned: 0,
          totalSales: '0',
          totalPurchases: '0',
          followers: 0,
          following: 0
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            sales: true,
            purchases: true,
            follows: true,
            priceAlerts: true
          },
          privacy: {
            showPublicProfile: true,
            showHoldings: true,
            showActivity: true,
            allowMessages: true
          },
          display: {
            theme: 'auto' as const,
            language: 'en',
            currency: 'USD',
            timezone: 'UTC'
          }
        },
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return res.json({
        success: true,
        data: defaultUser
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    logger.error('Error fetching user profile:', error)
    const err = createError('Failed to fetch user profile', 500)
    next(err)
  }
}

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicKey } = req.query
    const updateData = req.body
    
    if (!publicKey) {
      const err = createError('Public key is required', 400)
      return next(err)
    }

    const user = await User.findOneAndUpdate(
      { publicKey },
      { ...updateData, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    )

    res.json({
      success: true,
      data: user
    })

    // Invalidate user cache after profile update
    invalidateUserCache(publicKey as string).catch(error => 
      logger.error('Failed to invalidate cache after profile update:', error)
    )
  } catch (error) {
    logger.error('Error updating user profile:', error)
    const err = createError('Failed to update user profile', 500)
    next(err)
  }
}

export const createUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicKey, ...userData } = req.body
    
    if (!publicKey) {
      const err = createError('Public key is required', 400)
      return next(err)
    }

    // Check if user already exists
    const existingUser = await User.findOne({ publicKey })
    if (existingUser) {
      const err = createError('User already exists', 409)
      return next(err)
    }

    const user = new User({
      publicKey,
      ...userData,
      stats: {
        artworksCreated: 0,
        artworksOwned: 0,
        totalSales: '0',
        totalPurchases: '0',
        followers: 0,
        following: 0,
        ...userData.stats
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sales: true,
          purchases: true,
          follows: true,
          priceAlerts: true,
          ...userData.preferences?.notifications
        },
        privacy: {
          showPublicProfile: true,
          showHoldings: true,
          showActivity: true,
          allowMessages: true,
          ...userData.preferences?.privacy
        },
        display: {
          theme: 'auto',
          language: 'en',
          currency: 'USD',
          timezone: 'UTC',
          ...userData.preferences?.display
        }
      }
    })

    await user.save()

    res.status(201).json({
      success: true,
      data: user
    })
  } catch (error) {
    logger.error('Error creating user profile:', error)
    const err = createError('Failed to create user profile', 500)
    next(err)
  }
}

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicKey } = req.params
    
    const user = await User.findOne({ publicKey })
      .select('stats')
      .lean()

    if (!user) {
      const err = createError('User not found', 404)
      return next(err)
    }

    res.json({
      success: true,
      data: user.stats
    })
  } catch (error) {
    logger.error('Error fetching user stats:', error)
    const err = createError('Failed to fetch user stats', 500)
    next(err)
  }
}

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q: searchQuery, page = '1', limit = '20' } = req.query
    
    if (!searchQuery) {
      const err = createError('Search query is required', 400)
      return next(err)
    }

    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum

    const query = {
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { bio: { $regex: searchQuery, $options: 'i' } }
      ],
      'preferences.privacy.showPublicProfile': true
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('publicKey username avatar bio isVerified stats')
        .sort({ 'stats.followers': -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / limitNum)

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    })
  } catch (error) {
    logger.error('Error searching users:', error)
    const err = createError('Failed to search users', 500)
    next(err)
  }
}

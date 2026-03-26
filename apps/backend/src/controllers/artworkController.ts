import { Request, Response, NextFunction } from 'express'
import { createError } from '@/middleware/errorHandler'
import { createLogger } from '@/utils/logger'
import { Artwork, IArtwork } from '@/models'
import { ArtworkQueryParams, PaginatedResponse } from '@/types'

const logger = createLogger('ArtworkController')

export const getArtworks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      sort = 'createdAt',
      creator,
      minPrice,
      maxPrice,
      isListed,
      search
    } = req.query as ArtworkQueryParams

    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum

    // Build query
    const query: any = {}
    
    if (category) query.category = category
    if (creator) query.creator = creator
    if (isListed !== undefined) query.isListed = isListed === 'true'
    
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = minPrice
      if (maxPrice) query.price.$lte = maxPrice
    }

    if (search) {
      query.$text = { $search: search }
    }

    // Build sort
    let sortObj: any = {}
    switch (sort) {
      case 'price-asc':
        sortObj.price = 1
        break
      case 'price-desc':
        sortObj.price = -1
        break
      case 'title':
        sortObj.title = 1
        break
      case 'createdAt':
      default:
        sortObj.createdAt = -1
        break
    }

    const [artworks, total] = await Promise.all([
      Artwork.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('creator', 'username avatar isVerified')
        .lean(),
      Artwork.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / limitNum)

    const response: PaginatedResponse<IArtwork> = {
      success: true,
      data: artworks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }

    res.json(response)
  } catch (error) {
    logger.error('Error fetching artworks:', error)
    const err = createError('Failed to fetch artworks', 500)
    next(err)
  }
}

export const getArtworkById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const artwork = await Artwork.findById(id)
      .populate('creator', 'username avatar bio isVerified')
      .lean()

    if (!artwork) {
      const err = createError('Artwork not found', 404)
      return next(err)
    }

    res.json({
      success: true,
      data: artwork
    })
  } catch (error) {
    logger.error('Error fetching artwork by ID:', error)
    const err = createError('Failed to fetch artwork', 500)
    next(err)
  }
}

export const createArtwork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artworkData = req.body

    const artwork = new Artwork(artworkData)
    await artwork.save()

    res.status(201).json({
      success: true,
      data: artwork
    })
  } catch (error) {
    logger.error('Error creating artwork:', error)
    const err = createError('Failed to create artwork', 500)
    next(err)
  }
}

export const updateArtwork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const artwork = await Artwork.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!artwork) {
      const err = createError('Artwork not found', 404)
      return next(err)
    }

    res.json({
      success: true,
      data: artwork
    })
  } catch (error) {
    logger.error('Error updating artwork:', error)
    const err = createError('Failed to update artwork', 500)
    next(err)
  }
}

export const deleteArtwork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const artwork = await Artwork.findByIdAndDelete(id)

    if (!artwork) {
      const err = createError('Artwork not found', 404)
      return next(err)
    }

    res.json({
      success: true,
      message: 'Artwork deleted successfully'
    })
  } catch (error) {
    logger.error('Error deleting artwork:', error)
    const err = createError('Failed to delete artwork', 500)
    next(err)
  }
}

export const getArtworksByCreator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { creator } = req.params
    const { page = '1', limit = '20' } = req.query

    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum

    const query = { creator }

    const [artworks, total] = await Promise.all([
      Artwork.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Artwork.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / limitNum)

    const response: PaginatedResponse<IArtwork> = {
      success: true,
      data: artworks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }

    res.json(response)
  } catch (error) {
    logger.error('Error fetching artworks by creator:', error)
    const err = createError('Failed to fetch artworks by creator', 500)
    next(err)
  }
}

export const getArtworksByOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner } = req.params
    const { page = '1', limit = '20' } = req.query

    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum

    const query = { owner }

    const [artworks, total] = await Promise.all([
      Artwork.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('creator', 'username avatar isVerified')
        .lean(),
      Artwork.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / limitNum)

    const response: PaginatedResponse<IArtwork> = {
      success: true,
      data: artworks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }

    res.json(response)
  } catch (error) {
    logger.error('Error fetching artworks by owner:', error)
    const err = createError('Failed to fetch artworks by owner', 500)
    next(err)
  }
}

import { Request, Response, NextFunction } from 'express'
import Artwork from '@/models/Artwork'
import { createError } from '@/middleware/errorHandler'
import { createLogger } from '@/utils/logger'

const logger = createLogger('ArtworkController')

export const getArtworks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, creator, limit = 20, page = 1 } = req.query
    const query: any = {}

    if (category) query['metadata.category'] = category
    if (creator) query.creator = creator

    const artworks = await Artwork.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })

    const total = await Artwork.countDocuments(query)

    res.json({
      success: true,
      data: artworks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    logger.error('Failed to fetch artworks:', error)
    next(createError('Failed to fetch artworks', 500))
  }
}

export const getArtworkById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const artwork = await Artwork.findOne({ id })

    if (!artwork) {
      return next(createError('Artwork not found', 404))
    }

    res.json({
      success: true,
      data: artwork
    })
  } catch (error) {
    logger.error(`Failed to fetch artwork ${req.params.id}:`, error)
    next(createError('Failed to fetch artwork', 500))
  }
}

export const createArtwork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artworkData = req.body
    const artwork = await Artwork.create(artworkData)

    res.status(201).json({
      success: true,
      data: artwork
    })
  } catch (error) {
    logger.error('Failed to create artwork:', error)
    next(createError('Failed to create artwork', 400))
  }
}

export const updateArtwork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const artwork = await Artwork.findOneAndUpdate({ id }, req.body, { new: true, runValidators: true })

    if (!artwork) {
      return next(createError('Artwork not found', 404))
    }

    res.json({
      success: true,
      data: artwork
    })
  } catch (error) {
    logger.error(`Failed to update artwork ${req.params.id}:`, error)
    next(createError('Failed to update artwork', 400))
  }
}

export const deleteArtwork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const artwork = await Artwork.findOneAndDelete({ id })

    if (!artwork) {
      return next(createError('Artwork not found', 404))
    }

    res.json({
      success: true,
      message: 'Artwork deleted successfully'
    })
  } catch (error) {
    logger.error(`Failed to delete artwork ${req.params.id}:`, error)
    next(createError('Failed to delete artwork', 500))
  }
}

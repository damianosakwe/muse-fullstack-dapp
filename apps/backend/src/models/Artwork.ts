import mongoose, { Schema, Document } from 'mongoose'

export interface IArtwork extends Document {
  title: string
  description: string
  imageUrl: string
  price: string
  currency: string
  creator: string
  category: string
  prompt?: string
  aiModel?: string
  tokenId?: string
  owner?: string
  isListed: boolean
  metadata?: {
    attributes?: Array<{
      trait_type: string
      value: string | number
      display_type?: 'number' | 'date' | 'string'
    }>
    externalUrl?: string
    backgroundColor?: string
    animationUrl?: string
    youtubeUrl?: string
  }
  blockchainData?: {
    tokenId?: string
    contractAddress?: string
    transactionHash?: string
    blockNumber?: number
    owner?: string
    mintedAt?: Date
    network: 'testnet' | 'mainnet'
  }
  createdAt: Date
  updatedAt: Date
}

const ArtworkSchema = new Schema<IArtwork>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['XLM', 'USD', 'EUR'],
    default: 'XLM'
  },
  creator: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['abstract', 'portrait', 'landscape', 'fantasy', 'sci-fi', 'anime', 'photography', 'other'],
    index: true
  },
  prompt: {
    type: String,
    maxlength: 500
  },
  aiModel: {
    type: String,
    enum: ['stable-diffusion', 'midjourney', 'dall-e', 'custom'],
    index: true
  },
  tokenId: {
    type: String,
    sparse: true,
    unique: true
  },
  owner: {
    type: String,
    trim: true,
    index: true
  },
  isListed: {
    type: Boolean,
    default: true,
    index: true
  },
  metadata: {
    attributes: [{
      trait_type: String,
      value: Schema.Types.Mixed,
      display_type: {
        type: String,
        enum: ['number', 'date', 'string']
      }
    }],
    externalUrl: String,
    backgroundColor: String,
    animationUrl: String,
    youtubeUrl: String
  },
  blockchainData: {
    tokenId: String,
    contractAddress: String,
    transactionHash: String,
    blockNumber: Number,
    owner: String,
    mintedAt: Date,
    network: {
      type: String,
      enum: ['testnet', 'mainnet'],
      default: 'testnet'
    }
  }
}, {
  timestamps: true
})

// Indexes for performance optimization
ArtworkSchema.index({ creator: 1, createdAt: -1 })
ArtworkSchema.index({ category: 1, isListed: 1, createdAt: -1 })
ArtworkSchema.index({ owner: 1, isListed: 1 })
ArtworkSchema.index({ price: 1 })
ArtworkSchema.index({ createdAt: -1 })
ArtworkSchema.index({ title: 'text', description: 'text' })
ArtworkSchema.index({ aiModel: 1, createdAt: -1 })
ArtworkSchema.index({ 'blockchainData.network': 1 })
ArtworkSchema.index({ 'blockchainData.tokenId': 1 }, { sparse: true })

export const Artwork = mongoose.model<IArtwork>('Artwork', ArtworkSchema)

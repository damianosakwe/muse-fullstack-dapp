import mongoose, { Schema, Document } from 'mongoose'

export interface IArtwork extends Document {
  title: string
  description: string
  imageUrl: string
  price: string
  currency: string
  creator: string
  owner?: string
  category: string
  prompt?: string
  aiModel?: string
  tokenId?: string
  isListed?: boolean
  metadata?: {
    attributes?: Array<{
      trait_type: string
      value: string | number
      display_type?: 'number' | 'date' | 'string'
    }>
    externalUrl?: string
    backgroundColor?: string
  }
  createdAt: Date
  updatedAt: Date
}

const ArtworkSchema = new Schema<IArtwork>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: String, required: true },
  currency: { type: String, default: 'XLM' },
  creator: { type: String, required: true, index: true },
  owner: { type: String, index: true },
  category: { type: String, required: true, index: true },
  prompt: String,
  aiModel: String,
  tokenId: String,
  isListed: { type: Boolean, default: true, index: true },
  metadata: {
    attributes: [{
      trait_type: String,
      value: Schema.Types.Mixed,
      display_type: { type: String, enum: ['number', 'date', 'string'] }
    }],
    externalUrl: String,
    backgroundColor: String
  }
}, {
  timestamps: true
})

// Indexes for performance
ArtworkSchema.index({ category: 1, isListed: 1, createdAt: -1 })
ArtworkSchema.index({ creator: 1, createdAt: -1 })
ArtworkSchema.index({ price: 1 })
ArtworkSchema.index({ createdAt: -1 })

export const Artwork = mongoose.model<IArtwork>('Artwork', ArtworkSchema)
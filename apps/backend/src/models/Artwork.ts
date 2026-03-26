import mongoose, { Schema, Document } from 'mongoose'

export interface IArtwork extends Document {
  id: string
  title: string
  description?: string
  creator: string
  image: string
  price?: string
  currency: string
  metadata: {
    category?: string
    attributes?: Record<string, any>
    tags?: string[]
  }
}

const ArtworkSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  creator: { type: String, required: true, index: true },
  image: { type: String, required: true },
  price: { type: String, default: '0' },
  currency: { type: String, default: 'XLM' },
  metadata: {
    category: { type: String, default: 'Art' },
    attributes: { type: Schema.Types.Mixed, default: {} },
    tags: { type: [String], default: [] },
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

export default mongoose.model<IArtwork>('Artwork', ArtworkSchema)

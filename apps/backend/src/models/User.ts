import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  address: string
  username?: string
  email?: string
  bio?: string
  profileImage?: string
  bannerImage?: string
  website?: string
  twitter?: string
  discord?: string
  isVerified?: boolean
  stats: {
    created: number
    collected: number
    favorites: number
    totalSales?: string
    totalPurchases?: string
    followers?: number
    following?: number
  }
  preferences?: {
    notifications?: {
      email?: boolean
      push?: boolean
    }
    privacy?: {
      profileVisibility?: 'public' | 'private'
      showEmail?: boolean
    }
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  username: { type: String, trim: true, index: true },
  email: { type: String, trim: true, lowercase: true },
  bio: { type: String, maxlength: 500 },
  profileImage: String,
  bannerImage: String,
  website: String,
  twitter: String,
  discord: String,
  isVerified: { type: Boolean, default: false },
  stats: {
    created: { type: Number, default: 0 },
    collected: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    totalSales: { type: String, default: '0' },
    totalPurchases: { type: String, default: '0' },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: { 
        type: String, 
        enum: ['public', 'private'], 
        default: 'public' 
      },
      showEmail: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
})

// Indexes for performance
UserSchema.index({ username: 1 })
UserSchema.index({ address: 1 })
UserSchema.index({ 'stats.followers': -1 })

export const User = mongoose.model<IUser>('User', UserSchema)
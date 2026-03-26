import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  publicKey: string
  username?: string
  email?: string
  bio?: string
  website?: string
  twitter?: string
  discord?: string
  avatar?: string
  banner?: string
  isVerified: boolean
  stats: {
    artworksCreated: number
    artworksOwned: number
    totalSales: string
    totalPurchases: string
    followers: number
    following: number
  }
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      sales: boolean
      purchases: boolean
      follows: boolean
      priceAlerts: boolean
    }
    privacy: {
      showPublicProfile: boolean
      showHoldings: boolean
      showActivity: boolean
      allowMessages: boolean
    }
    display: {
      theme: 'light' | 'dark' | 'auto'
      language: string
      currency: string
      timezone: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  publicKey: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  website: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  discord: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  banner: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  stats: {
    artworksCreated: {
      type: Number,
      default: 0,
      index: true
    },
    artworksOwned: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: String,
      default: '0'
    },
    totalPurchases: {
      type: String,
      default: '0'
    },
    followers: {
      type: Number,
      default: 0,
      index: true
    },
    following: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sales: { type: Boolean, default: true },
      purchases: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
      priceAlerts: { type: Boolean, default: true }
    },
    privacy: {
      showPublicProfile: { type: Boolean, default: true },
      showHoldings: { type: Boolean, default: true },
      showActivity: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true }
    },
    display: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      language: { type: String, default: 'en' },
      currency: { type: String, default: 'USD' },
      timezone: { type: String, default: 'UTC' }
    }
  }
}, {
  timestamps: true
})

// Indexes for performance optimization
UserSchema.index({ publicKey: 1 }, { unique: true })
UserSchema.index({ username: 1 }, { unique: true, sparse: true })
UserSchema.index({ email: 1 }, { unique: true, sparse: true })
UserSchema.index({ isVerified: 1, createdAt: -1 })
UserSchema.index({ 'stats.artworksCreated': -1 })
UserSchema.index({ 'stats.followers': -1 })
UserSchema.index({ createdAt: -1 })

export const User = mongoose.model<IUser>('User', UserSchema)

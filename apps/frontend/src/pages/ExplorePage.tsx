import { useState } from 'react'

export function ExplorePage() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="mobile-section">
        <div className="flex items-center justify-between mb-6">
          <h1 className="heading-mobile">Explore Artworks</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline text-sm px-4 py-2 touch-manipulation"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>
        
        {/* Mobile Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Category</label>
                <select className="input w-full">
                  <option>All Categories</option>
                  <option>Abstract</option>
                  <option>Portrait</option>
                  <option>Landscape</option>
                  <option>Fantasy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Price Range</label>
                <select className="input w-full">
                  <option>Any Price</option>
                  <option>0 - 0.1 ETH</option>
                  <option>0.1 - 0.5 ETH</option>
                  <option>0.5 - 1 ETH</option>
                  <option>1+ ETH</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Sort By</label>
                <select className="input w-full">
                  <option>Recently Created</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop Filters (hidden on mobile) */}
        <div className="hidden lg:block">
          <div className="lg:w-64 space-y-6 mb-8">
            <div>
              <h3 className="font-semibold text-secondary-900 mb-3">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Category</label>
                  <select className="input w-full">
                    <option>All Categories</option>
                    <option>Abstract</option>
                    <option>Portrait</option>
                    <option>Landscape</option>
                    <option>Fantasy</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Price Range</label>
                  <select className="input w-full">
                    <option>Any Price</option>
                    <option>0 - 0.1 ETH</option>
                    <option>0.1 - 0.5 ETH</option>
                    <option>0.5 - 1 ETH</option>
                    <option>1+ ETH</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Sort By</label>
                  <select className="input w-full">
                    <option>Recently Created</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Artwork Grid */}
        <div className="grid-mobile xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="card-mobile overflow-hidden group cursor-pointer touch-manipulation">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 group-hover:scale-105 transition-transform" />
              <div className="p-4">
                <h3 className="font-semibold text-secondary-900 text-mobile-base">AI Artwork #{i}</h3>
                <p className="text-mobile-sm text-secondary-600 mb-2">Generated with AI Model</p>
                <div className="flex items-center justify-between">
                  <span className="text-mobile-sm font-medium text-secondary-900">0.1 ETH</span>
                  <button className="btn-primary text-mobile-sm px-4 py-2 touch-manipulation">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

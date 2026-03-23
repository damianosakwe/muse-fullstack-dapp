export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mobile-section">
        <div className="text-center space-y-6">
          <h1 className="heading-mobile text-center">
            Discover AI-Generated
            <span className="block text-primary-600">Digital Art</span>
          </h1>
          
          <p className="text-mobile-base text-secondary-600 mobile-container">
            Explore, collect, and create unique AI-generated artworks on the blockchain. 
            Each piece is a one-of-a-kind digital collectible.
          </p>
          
          <div className="flex flex-col gap-3 mobile-container">
            <button className="btn-primary w-full text-base font-medium">
              Start Exploring
            </button>
            <button className="btn-outline w-full text-base font-medium">
              Create Art
            </button>
          </div>
        </div>
      </div>
      
      <div className="mobile-section">
        <h2 className="subheading-mobile mb-6">Featured Artworks</h2>
        <div className="grid-mobile xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-mobile">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4" />
              <div className="space-y-2">
                <h3 className="font-semibold text-secondary-900 text-mobile-base">AI Artwork #{i}</h3>
                <p className="text-secondary-600 text-mobile-sm">Generated with AI Model</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-mobile-sm text-secondary-500 font-medium">0.1 ETH</span>
                  <button className="btn-primary text-mobile-sm px-4 py-2 touch-manipulation">
                    View
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

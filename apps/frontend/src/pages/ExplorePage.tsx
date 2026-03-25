import { useState, useEffect, useMemo } from "react";
import {
  useArtworks,
  type Artwork,
  type ArtworksFilters,
} from "@/services/artworkService";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { FilterPanel } from "@/components/FilterPanel";
import { Search, WifiOff, X } from "lucide-react";
import { getFilteredMockArtworks } from "../data/mock-api";

/** Case-insensitive full-text search across all meaningful artwork fields */
function applySearchTerm(artworks: Artwork[], term: string): Artwork[] {
  const q = term.trim().toLowerCase();
  if (!q) return artworks;
  return artworks.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.creator.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.aiModel?.toLowerCase().includes(q) ||
      a.prompt?.toLowerCase().includes(q)
  );
}

export function ExplorePage() {
  const [filters, setFilters] = useState<ArtworksFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [usingMockData, setUsingMockData] = useState(false);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useArtworks(filters);

  const apiArtworks: Artwork[] = data?.pages.flatMap((p) => p.data) ?? [];

  useEffect(() => {
    if (isError && apiArtworks.length === 0) setUsingMockData(true);
    if (!isError && apiArtworks.length > 0) setUsingMockData(false);
  }, [isError, apiArtworks.length]);

  const baseArtworks: Artwork[] = usingMockData
    ? getFilteredMockArtworks(filters)
    : apiArtworks;

  const artworks = useMemo(
    () => applySearchTerm(baseArtworks, appliedSearch),
    [baseArtworks, appliedSearch]
  );

  const hasActiveSearch = appliedSearch.trim().length > 0;
  const hasFilters =
    hasActiveSearch ||
    Boolean(filters.category) ||
    Boolean(filters.priceRange) ||
    Boolean(filters.sortBy);

  const showLoading = isLoading && artworks.length === 0;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchTerm.trim());
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setAppliedSearch("");
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setAppliedSearch("");
  };

  const handlePurchase = (artwork: Artwork) => {
    console.log("Purchase:", artwork.title);
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="mobile-section pb-2">
        <h1 className="heading-mobile mb-6">Explore Artworks</h1>

        {/* Offline banner */}
        {usingMockData && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm text-yellow-400">
            <WifiOff className="h-4 w-4 shrink-0" />
            <span>
              Server unavailable — showing sample artworks. Live data will load
              automatically once the connection is restored.
            </span>
          </div>
        )}

        <div className="mobile-container mb-6">
          {/* ── Search + Filter row ── */}
          <div className="flex gap-2 mb-4">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-500" />
                <input
                  type="text"
                  placeholder="Search by title, creator, style..."
                  className="input pl-10 pr-9 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && handleSearchClear()}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary px-4 hidden sm:block text-sm"
              >
                Search
              </button>
            </form>

            {/* Mobile filter button — rendered inside FilterPanel */}
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
            />
          </div>

          {/* Desktop filter dropdowns — also inside FilterPanel */}
          <div className="hidden sm:block">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
            />
          </div>

          {/* Search result count */}
          {hasActiveSearch && (
            <p className="text-sm text-secondary-400 mt-3">
              {artworks.length === 0
                ? `No results for "${appliedSearch}"`
                : `${artworks.length} result${artworks.length !== 1 ? "s" : ""} for "${appliedSearch}"`}
            </p>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mobile-section pt-0">
        <ArtworkGrid
          artworks={artworks}
          isLoading={showLoading}
          hasNextPage={hasActiveSearch || usingMockData ? false : !!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => {
            if (!usingMockData && !hasActiveSearch && hasNextPage)
              fetchNextPage();
          }}
          onPurchase={handlePurchase}
          onClearFilters={handleClearFilters}
          hasFilters={hasFilters}
        />
      </div>
    </div>
  );
}

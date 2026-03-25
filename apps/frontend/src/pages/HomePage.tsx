import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MoveRight } from "lucide-react";
import {
  useFeaturedArtworks,
  useTrendingArtworks,
  usePlatformStats,
} from "@/services/artworkService";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { MetaTags } from "@/components/MetaTags";

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_WORDS = [
  "AI Art",
  "Stellar Network",
  "NFT Ownership",
  "Instant Mint",
  "On-Chain",
  "Artist Royalties",
  "Low Fees",
  "Open Market",
];

function Ticker() {
  const items = [...TICKER_WORDS, ...TICKER_WORDS];
  return (
    <div className="overflow-hidden border-y border-secondary-800 py-3 bg-secondary-950/80 select-none">
      <div className="flex gap-0 animate-ticker w-max">
        {items.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-5 px-5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-secondary-500 font-medium whitespace-nowrap">
              {w}
            </span>
            <span className="w-[3px] h-[3px] rounded-full bg-secondary-700 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Stat ─────────────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-secondary-800 pl-6 first:border-l-0 first:pl-0">
      <div className="text-[1.6rem] font-bold text-white leading-none tracking-tight tabular-nums">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-secondary-600 mt-1.5">
        {label}
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <span className="text-[10px] font-mono text-secondary-700 tabular-nums">
        {index}
      </span>
      <span className="block h-px w-6 bg-secondary-800" />
      <h2 className="text-sm uppercase tracking-[0.18em] text-secondary-400 font-medium">
        {title}
      </h2>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
export function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useFeaturedArtworks();
  const { data: trending, isLoading: trendingLoading } = useTrendingArtworks();
  const { data: stats } = usePlatformStats();

  const featuredRef = useRef<HTMLElement>(null);

  const scrollToFeatured = () =>
    featuredRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-white">
      <MetaTags
        title="Muse — AI Art Marketplace"
        description="Discover, collect, and sell extraordinary AI-generated artwork on the Stellar network."
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92dvh] flex flex-col justify-between pt-16 pb-0 overflow-hidden">
        {/* Full-bleed noise texture overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />

        {/* Content */}
        <div className="container mx-auto px-4 flex-1 flex flex-col justify-center pt-8 pb-16">
          {/* Eyebrow */}
          <p className="text-[10px] uppercase tracking-[0.25em] text-secondary-600 mb-10 font-medium">
            The AI Art Marketplace on Stellar
          </p>

          {/* Headline — split layout, not centered */}
          <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-end">
            <h1 className="text-[clamp(3.2rem,9vw,7.5rem)] font-black leading-[0.88] tracking-[-0.03em] text-white">
              Where AI
              <br />
              art finds
              <br />
              <span className="text-secondary-600">its owner.</span>
            </h1>

            {/* Right column — description + CTA */}
            <div className="flex flex-col gap-8 pb-2">
              <p className="text-secondary-400 text-base leading-relaxed">
                Muse is a marketplace built for AI-generated art — mint, list,
                and collect pieces on the Stellar network with near-zero fees
                and true on-chain ownership.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/explore"
                  className="btn-primary flex items-center justify-between gap-4 px-5 py-3.5 text-sm font-semibold group"
                >
                  <span>Browse the Collection</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  to="/mint"
                  className="btn-outline flex items-center justify-between gap-4 px-5 py-3.5 text-sm font-semibold"
                >
                  <span>Mint Your Art</span>
                  <ArrowUpRight className="h-4 w-4 opacity-50" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar — pinned to bottom of hero */}
        <div className="border-t border-secondary-800 bg-secondary-950/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-5 flex flex-wrap gap-y-4 gap-x-0 justify-between sm:justify-start sm:gap-x-0">
            <Stat
              value={
                stats ? `${(stats.totalArtworks / 1000).toFixed(1)}k` : "12.8k"
              }
              label="Works Minted"
            />
            <Stat
              value={
                stats ? `${(stats.totalArtists / 1000).toFixed(1)}k` : "3.2k"
              }
              label="Artists"
            />
            <Stat
              value={
                stats
                  ? `${stats.totalVolume} ${stats.volumeCurrency}`
                  : "2.4M XLM"
              }
              label="Volume Traded"
            />
            <Stat
              value={
                stats ? `${(stats.totalCollectors / 1000).toFixed(1)}k` : "8.7k"
              }
              label="Collectors"
            />
          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────────── */}
      <Ticker />

      {/* ── FEATURED ─────────────────────────────────────────────────────── */}
      <section ref={featuredRef} className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <SectionLabel index="01" title="Featured Works" />
            <Link
              to="/explore"
              className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-secondary-500 hover:text-white transition-colors font-medium group"
            >
              View All
              <MoveRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ArtworkGrid
            artworks={featured || []}
            isLoading={featuredLoading}
            hasNextPage={false}
            isFetchingNextPage={false}
            onLoadMore={() => {}}
            loadingCount={4}
          />

          <div className="mt-6 sm:hidden">
            <Link
              to="/explore"
              className="btn-outline w-full justify-center text-sm"
            >
              View All Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRENDING ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-t border-secondary-800/60">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <SectionLabel index="02" title="Trending Now" />
            <div className="flex items-center gap-2 pb-[2px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-secondary-600 font-medium">
                Live
              </span>
            </div>
          </div>

          <ArtworkGrid
            artworks={trending || []}
            isLoading={trendingLoading}
            hasNextPage={false}
            isFetchingNextPage={false}
            onLoadMore={() => {}}
            loadingCount={4}
          />
        </div>
      </section>

      {/* ── WHY MUSE ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-t border-secondary-800/60">
        <div className="container mx-auto px-4">
          <SectionLabel index="03" title="Why Muse" />

          {/* Three-column table layout — no icon circles */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-secondary-800">
            {[
              {
                heading: "Fast & cheap.",
                body: "Stellar settles transactions in 3–5 seconds for a fraction of a cent. Mint your whole portfolio without watching fees eat your earnings.",
              },
              {
                heading: "You own it.",
                body: "Every piece is on-chain with full provenance. No platform lock-in, no rug-pulls — your NFTs exist independently of Muse.",
              },
              {
                heading: "Built for AI art.",
                body: "Prompts, model names, and generation parameters are stored in metadata. Your creative process is part of the work.",
              },
            ].map(({ heading, body }) => (
              <div
                key={heading}
                className="py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 group"
              >
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                  {heading}
                </h3>
                <p className="text-secondary-500 text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-t border-secondary-800/60">
        <div className="container mx-auto px-4">
          {/* Full-width bordered block — no rounded card, no blobs */}
          <div className="relative border border-secondary-800 overflow-hidden">
            {/* Hairline accent top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />

            <div className="px-8 py-16 md:px-16 md:py-20 grid md:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary-600 mb-4 font-medium">
                  Get started today
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-[0.95] tracking-tight">
                  Your art deserves
                  <br />
                  an audience.
                </h2>
                <p className="text-secondary-500 text-sm mt-5 max-w-md leading-relaxed">
                  Join thousands of artists already minting on Muse. It takes
                  under a minute to list your first piece.
                </p>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                <Link
                  to="/mint"
                  className="btn-primary flex items-center justify-between gap-4 px-5 py-3.5 text-sm font-semibold group"
                >
                  <span>Start Creating</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  to="/explore"
                  className="btn-outline flex items-center justify-between gap-4 px-5 py-3.5 text-sm font-semibold"
                >
                  <span>Explore Works</span>
                  <ArrowUpRight className="h-4 w-4 opacity-40" />
                </Link>
              </div>
            </div>

            {/* Hairline accent bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary-700/40 to-transparent" />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 32s linear infinite;
        }
      `}</style>
    </div>
  );
}

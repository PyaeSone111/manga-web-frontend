import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { brandingApi } from '../services/api';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/api\/v1\/?$/, '');

function toAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

const DEFAULT_CARD_LAYOUT = {
  home_latest: 'card_01',
  home_popular: 'card_11',
  home_weekly_highlights: 'card_03',
  home_recently_added: 'card_13',
  browse: 'card_11',
  rankings_top: 'card_15',
  rankings_most_read: 'card_15',
  rankings_trending: 'card_20',
  recently_viewed: 'card_04',
  favorites: 'card_11',
};

const GRID_SECTION_KEYS = [
  'home_latest', 'home_popular', 'home_weekly_highlights', 'home_recently_added',
  'browse', 'rankings_top', 'rankings_most_read', 'rankings_trending', 'favorites',
];

const defaultColsVertical = { default: 2, sm: 3, md: 4, lg: 5, xl: 6 };
const defaultColsHorizontal = { default: 1, sm: 2, md: 3, lg: 4, xl: 5 };

const DEFAULT_GRID_COLUMNS = Object.fromEntries(
  GRID_SECTION_KEYS.map((key) => [
    key,
    ['home_latest', 'home_weekly_highlights'].includes(key) ? defaultColsVertical : defaultColsHorizontal,
  ])
);

const BrandingContext = createContext({
  logoUrl: null,
  heroBackgroundUrl: null,
  heroImageUrl: null,
  cardLayout: DEFAULT_CARD_LAYOUT,
  gridColumns: DEFAULT_GRID_COLUMNS,
  isLoading: false,
});

export function BrandingProvider({ children }) {
  const { data, isLoading } = useQuery({
    queryKey: ['branding'],
    queryFn: () => brandingApi.getBranding(),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const branding = data?.data ?? {};
  const value = {
    logoUrl: toAbsoluteUrl(branding.logo_url) ?? null,
    heroBackgroundUrl: toAbsoluteUrl(branding.hero_background_url) ?? null,
    heroImageUrl: toAbsoluteUrl(branding.hero_image_url) ?? null,
    cardLayout: branding.card_layout ?? DEFAULT_CARD_LAYOUT,
    gridColumns: branding.grid_columns ?? DEFAULT_GRID_COLUMNS,
    isLoading,
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}

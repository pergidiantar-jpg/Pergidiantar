import React from 'react';

export const DEFAULT_FALLBACK_IMAGES = {
  jogja: '/assets/images/dest_jogja_heritage_1793579234240.jpg',
  malang: '/assets/images/dest_malang_bromo_1793579235303.jpg',
  bali: '/assets/images/dest_bali_paradise_1793579235747.jpg',
  fleet: '/assets/images/fleet_hiace_bus_pergidiantar_1793579236036.jpg',
  general: '/assets/images/hero_pergidiantar_travel_1793579233622.jpg',
  logo: '/assets/aistudio/1793582722648_90a12056.jpg'
};

/**
 * Normalizes any image path (converts legacy '/src/assets/images/...' to public '/assets/images/...').
 */
export function normalizeImagePath(path?: string | null, fallbackCategory: 'jogja' | 'malang' | 'bali' | 'fleet' | 'general' = 'general'): string {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return DEFAULT_FALLBACK_IMAGES[fallbackCategory] || DEFAULT_FALLBACK_IMAGES.general;
  }

  const trimmed = path.trim();

  // Normalize legacy /src/assets/images/ path to /assets/images/
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/assets/images/');
  }

  // If path is relative 'src/assets/images/', convert to '/assets/images/'
  if (trimmed.startsWith('src/assets/images/')) {
    return '/' + trimmed.replace('src/assets/images/', 'assets/images/');
  }

  return trimmed;
}

/**
 * Returns a reliable fallback image URL based on destination string or region
 */
export function getDestinationFallbackImage(destination?: string): string {
  if (!destination) return DEFAULT_FALLBACK_IMAGES.general;
  const lower = destination.toLowerCase();
  if (lower.includes('jogja') || lower.includes('yogyakarta')) {
    return DEFAULT_FALLBACK_IMAGES.jogja;
  }
  if (lower.includes('malang') || lower.includes('bromo') || lower.includes('batu')) {
    return DEFAULT_FALLBACK_IMAGES.malang;
  }
  if (lower.includes('bali') || lower.includes('denpasar') || lower.includes('kuta') || lower.includes('ubud')) {
    return DEFAULT_FALLBACK_IMAGES.bali;
  }
  return DEFAULT_FALLBACK_IMAGES.general;
}

/**
 * Standard image onError handler to prevent broken image badges
 */
export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackCategory?: 'jogja' | 'malang' | 'bali' | 'fleet' | 'general' | string
) {
  const target = e.currentTarget;
  if (target.dataset.hasFailedFallback === 'true') {
    // Already attempted fallback, stop to prevent infinite re-triggers
    return;
  }
  target.dataset.hasFailedFallback = 'true';

  let fallback = DEFAULT_FALLBACK_IMAGES.general;
  if (fallbackCategory && fallbackCategory in DEFAULT_FALLBACK_IMAGES) {
    fallback = DEFAULT_FALLBACK_IMAGES[fallbackCategory as keyof typeof DEFAULT_FALLBACK_IMAGES];
  } else if (typeof fallbackCategory === 'string') {
    fallback = getDestinationFallbackImage(fallbackCategory);
  }

  target.src = fallback;
}

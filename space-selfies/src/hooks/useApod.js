// src/hooks/useApod.js
import { useQuery } from '@tanstack/react-query';
import { fetchApod, fetchRandomApods } from '../api/nasaApi';

/**
 * useApod(date)
 *
 * Custom hook that wraps React Query's useQuery to fetch
 * a single APOD image (today's or a specific date).
 *
 * @param {string} [date] - optional date (YYYY-MM-DD)
 *
 * Returns:
 *   - data: APOD object (or undefined while loading)
 *   - isLoading: boolean
 *   - isError: boolean
 *   - error: Error object (if any)
 *   - refetch: function to manually re-run the query
 */
export function useApod(date) {
  return useQuery({
    // queryKey tells React Query what this data is.
    // If the "date" changes, React Query treats it as a different cache key.
    queryKey: ['apod', date || 'today'],
    // queryFn is the function that actually fetches the data.
    queryFn: () => fetchApod(date),
  });
}

/**
 * useRandomApods(count)
 *
 * Custom hook to fetch a set of random APOD images.
 *
 * @param {number} count - how many random APOD items to fetch
 */
export function useRandomApods(count = 8) {
  return useQuery({
    queryKey: ['apodRandom', count],
    queryFn: () => fetchRandomApods(count),
  });
}

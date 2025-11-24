// We read the API key from an environment variable.
// In Vite, any variable starting with VITE_ is exposed to the frontend.
// You'll need a .env file with: VITE_NASA_API_KEY=your_real_key
// const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
console.log('NASA API KEY in app:', API_KEY);


// Base URL for NASA's Astronomy Picture of the Day (APOD) API.
// Docs: https://api.nasa.gov/ (click "APOD" / "APOD Docs")
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// src/api/nasaApi.js

/**
 * Fetch a single APOD image.
 *
 * @param {string} [date] - Optional date in YYYY-MM-DD format.
 *   - If no date is provided, NASA returns today's picture.
 *   - If a date is provided, APOD returns that day's picture.
 *
 * This function:
 *   1. Builds the query string with your API key and optional date.
 *   2. Calls the NASA APOD endpoint with fetch().
 *   3. Checks for errors (non-200 responses).
 *   4. Parses the JSON body.
 *   5. Ensures the result is an image (sometimes APOD is a video).
 *   6. Returns a "clean" object with only the fields we care about.
 */
export async function fetchApod(date) {
  // Build the query string parameters.
  const params = new URLSearchParams({
    api_key: API_KEY,     // required for NASA APIs
  });

  // If the caller passed a date, include it in the query.
  if (date) {
    params.set('date', date); // NASA expects YYYY-MM-DD
  }

  // Construct the full URL, e.g.
  // https://api.nasa.gov/planetary/apod?api_key=...&date=2024-01-01
  const url = `${BASE_URL}?${params.toString()}`;

  // Make the HTTP request.
  const res = await fetch(url);

  // If response is not OK (status code 200–299), throw an error.
  // React Query will catch this and expose it via `error` and `isError`.
  if (!res.ok) {
    throw new Error('Failed to fetch APOD from NASA API');
  }

  // Parse the JSON response body.
  const data = await res.json();

  // APOD is sometimes a video (e.g., YouTube or Vimeo).
  // For our space selfie background, we only want images.
  if (data.media_type !== 'image') {
    throw new Error('APOD for this date is not an image');
  }

  // Return only the fields we care about.
  // This "normalizes" NASA's response so the rest of your app
  // doesn't have to know about every possible field.
  return {
    date: data.date,
    title: data.title,
    explanation: data.explanation,
    url: data.url,     // image URL we will use as background
    hdurl: data.hdurl, // high-res image (optional)
  };
}

/**
 * Fetch multiple random APOD images.
 *
 * @param {number} count - How many random items to request.
 *   NASA's APOD API has a "count" parameter to return multiple random entries.
 */
export async function fetchRandomApods(count = 8) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    count: String(count),
  });

  const url = `${BASE_URL}?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch random APOD images');
  }

  const list = await res.json();

  // Filter to keep only images and transform each item to our clean format.
  return list
    .filter((item) => item.media_type === 'image')
    .map((item) => ({
      date: item.date,
      title: item.title,
      explanation: item.explanation,
      url: item.url,
      hdurl: item.hdurl,
    }));
}

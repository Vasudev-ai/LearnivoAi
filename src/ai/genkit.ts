import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Support multiple keys for rotation (to avoid 429 Rate Limit errors)
const keysString = process.env.GOOGLE_GENAI_API_KEYS || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || "";
const apiKeys = keysString.split(',').map(k => k.trim()).filter(Boolean);

if (apiKeys.length === 0) {
  console.warn("WARNING: No Google AI API Keys found in environment variables!");
}

let currentKeyIndex = 0;

/**
 * Returns the next API key in the list (Round-robin)
 */
export function getNextApiKey() {
  if (apiKeys.length === 0) return "";
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return key;
}

// Initial instance using the first key
export const ai = genkit({
  plugins: [googleAI({ apiKey: apiKeys[0] || "" })],
  model: 'googleai/gemini-2.5-flash',
});

/**
 * Returns a new Genkit instance with a fresh rotated API key.
 * Use this for high-frequency tasks to spread load across keys.
 */
export function getRotatedAi() {
    return genkit({
        plugins: [googleAI({ apiKey: getNextApiKey() })],
        model: 'googleai/gemini-2.5-flash',
    });
}

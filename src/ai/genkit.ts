import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const keysString = process.env.GOOGLE_GENAI_API_KEYS || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || "";
const apiKeys = keysString.split(',').map(k => k.trim()).filter(Boolean);

if (apiKeys.length === 0) {
  console.warn("WARNING: No Google AI API Keys found in environment variables!");
}

let currentKeyIndex = 0;

export function getNextApiKey(): string {
  if (apiKeys.length === 0) return "";
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return key;
}

export function getAvailableKeys(): string[] {
  return apiKeys;
}

export function getCurrentKeyIndex(): number {
  return currentKeyIndex;
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: apiKeys[0] || "" })],
  model: 'googleai/gemini-2.5-flash',
});

export function createRotatedAi() {
  return genkit({
    plugins: [googleAI({ apiKey: getNextApiKey() })],
    model: 'googleai/gemini-2.5-flash',
  });
}

export function logApiKeyStatus(): void {
  if (apiKeys.length > 1) {
    console.log(`[API Key Rotation] ${apiKeys.length} keys configured, currently using key index: ${currentKeyIndex % apiKeys.length}`);
  } else if (apiKeys.length === 1) {
    console.log(`[API Key] Single key configured (key rotation disabled - only 1 key available)`);
  } else {
    console.warn(`[API Key] No API keys configured!`);
  }
}

logApiKeyStatus();

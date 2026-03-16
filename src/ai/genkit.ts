import {genkit} from 'genkit';
import {googleAI, gemini15Flash, gemini15Pro} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("WARNING: Google AI API Key is missing in environment variables!");
}

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: 'googleai/gemini-2.5-flash',
});


import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';
config({ path: 'd:/March/learnivo/.env' });

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

const ai = genkit({
  plugins: [googleAI({ apiKey })],
});

async function main() {
    try {
        console.log(`Testing model: gemini-1.5-flash (no prefix)...`);
        const res = await ai.generate({
            model: 'gemini-1.5-flash',
            prompt: 'Hi'
        });
        console.log(`SUCCESS: ${res.text}`);
    } catch (e: any) {
        console.error(`FAILED: ${e.message}`);
    }
}

main();

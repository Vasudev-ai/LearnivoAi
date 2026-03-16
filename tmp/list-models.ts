
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';
config({ path: 'd:/March/learnivo/.env' });

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

async function main() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log('Available Models:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error listing models:', e.message);
    }
}

main();

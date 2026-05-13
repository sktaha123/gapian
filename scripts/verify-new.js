import { GoogleGenAI } from '@google/genai';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VITE_GCP_PROJECT_ID;
const location = process.env.VITE_GCP_LOCATION || 'us-central1';

async function verifyWithNewSDK() {
  console.log('--- Vertex AI Verification (2026 SDK) ---');
  
  try {
    const tokenRes = await fetch('http://localhost:3002/token');
    const { token } = await tokenRes.json();

    const client = new GoogleGenAI({
      project,
      location,
      authToken: token, // Manual token injection for the new SDK
    });

    console.log('Sending test request via client.models.generateContent...');
    
    const result = await client.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [{ role: 'user', parts: [{ text: 'Hi' }] }]
    });

    console.log('\n🎉 SUCCESS!');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('\nVerification failed!');
    console.error(error.message);
  }
}

verifyWithNewSDK();

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VITE_GCP_PROJECT_ID;
const location = process.env.VITE_GCP_LOCATION || 'us-central1';

const modelsToTry = [
  'gemini-3.1-flash-lite',
  'gemini-3.1-flashlite',
  'gemini-3-flash-lite',
  'gemini-3-flash',
  'gemini-3.0-flash'
];

async function finalTry() {
  const tokenRes = await fetch('http://localhost:3001/token');
  const { token } = await tokenRes.json();
  
  for (const model of modelsToTry) {
    console.log(`Trying ${model}...`);
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'hi' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });
    
    if (res.ok) {
      console.log(`\n🎉 SUCCESS! The correct ID is: ${model}`);
      return;
    } else {
      const data = await res.json();
      console.log(`❌ ${model} failed: ${data.error?.message}`);
    }
  }
}

finalTry();

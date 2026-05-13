import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VITE_GCP_PROJECT_ID;
const location = process.env.VITE_GCP_LOCATION || 'global';
const model = 'gemini-3.1-flash-lite';

async function finalVerify() {
  console.log('--- Final Vertex AI Verification (Global) ---');
  console.log(`Project: ${project}`);
  console.log(`Location: ${location}`);
  
  try {
    const tokenRes = await fetch('http://localhost:3002/token');
    const { token } = await tokenRes.json();

    const domain = location === 'global' ? 'aiplatform.googleapis.com' : `${location}-aiplatform.googleapis.com`;
    const url = `https://${domain}/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`;
    
    console.log('Sending request to Vertex AI...');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Write a one-sentence greeting for Gapian.' }] }],
        generationConfig: { maxOutputTokens: 100 }
      })
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log('\n🎉 SUCCESS!');
      console.log('Response:', data.candidates[0].content.parts[0].text);
      console.log('\nYour $300 GCP credits are officially being used.');
    } else {
      console.error('\nVerification failed!');
      console.error(data.error?.message || JSON.stringify(data));
    }
  } catch (error) {
    console.error('\nError:', error.message);
  }
}

finalVerify();

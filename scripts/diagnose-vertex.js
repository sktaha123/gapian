import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const modelsToTry = [
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro-002',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

async function diagnose() {
  const project = process.env.VITE_GCP_PROJECT_ID;
  const location = process.env.VITE_GCP_LOCATION || 'us-central1';
  
  try {
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
      
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ SUCCESS: ${model} is working!`);
        return;
      } else {
        console.log(`❌ FAILED: ${model} - ${data.error?.message || 'Unknown error'}`);
      }
    }
  } catch (e) {
    console.error('Diagnostic error:', e.message);
  }
}

diagnose();

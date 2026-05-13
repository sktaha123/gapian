import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VITE_GCP_PROJECT_ID;
const location = process.env.VITE_GCP_LOCATION || 'us-central1';
const model = 'gemini-3.1-flash-lite';

async function testDirect() {
  const tokenRes = await fetch('http://localhost:3001/token');
  const { token } = await tokenRes.json();
  
  console.log(`\n--- Testing Direct Model Path (No Publisher) ---`);
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/models/${model}:generateContent`;
  
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
    console.log(`🎉 SUCCESS! The direct path works.`);
  } else {
    console.log(`❌ Failed: ${data.error?.message}`);
  }
}

testDirect();

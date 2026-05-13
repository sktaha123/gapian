import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VITE_GCP_PROJECT_ID;
const location = process.env.VITE_GCP_LOCATION || 'us-central1';
const model = 'gemini-3.1-flash-lite';

async function testEndpoints() {
  const tokenRes = await fetch('http://localhost:3001/token');
  const { token } = await tokenRes.json();
  
  const versions = ['v1', 'v1beta'];
  
  for (const v of versions) {
    console.log(`\n--- Testing ${v} endpoint ---`);
    const url = `https://${location}-aiplatform.googleapis.com/${v}/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`;
    
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
    
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Raw: ${text.slice(0, 500)}`);
    
    if (res.ok) {
      console.log(`🎉 SUCCESS! The ${v} endpoint works.`);
    }
  }
}

testEndpoints();

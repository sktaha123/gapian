import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VITE_GCP_PROJECT_ID;
const location = process.env.VITE_GCP_LOCATION || 'us-central1';

const publishers = ['google', 'google-cloud', 'google-agent', 'agent-platform'];
const model = 'gemini-3.1-flash-lite';

async function scanPublishers() {
  const tokenRes = await fetch('http://localhost:3001/token');
  const { token } = await tokenRes.json();
  
  console.log(`Scanning publishers for ${model} in ${location}...\n`);
  
  for (const pub of publishers) {
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/${pub}/models/${model}:generateContent`;
    
    try {
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
        console.log(`\n✅ SUCCESS! The correct publisher is: ${pub}`);
        return;
      } else {
        console.log(`❌ ${pub} failed (Status: ${res.status})`);
      }
    } catch (e) {}
  }
}

scanPublishers();

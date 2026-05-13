import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VITE_GCP_PROJECT_ID;

const regions = [
  'us-central1', 'us-east1', 'us-east4', 'us-west1', 'europe-west1', 
  'europe-west4', 'europe-west9', 'asia-northeast1'
];

const models = [
  'gemini-3.1-flash-lite',
  'gemini-3-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-2.0-flash',
  'gemini-pro'
];

async function bruteForce() {
  const tokenRes = await fetch('http://localhost:3001/token');
  const { token } = await tokenRes.json();
  
  console.log(`Starting Brute Force Scan for project: ${project}...\n`);
  
  for (const region of regions) {
    console.log(`Checking Region: ${region}...`);
    for (const model of models) {
      const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${project}/locations/${region}/publishers/google/models/${model}:generateContent`;
      
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
          console.log(`\n\n🎉 SUCCESS FOUND!`);
          console.log(`REGION: ${region}`);
          console.log(`MODEL:  ${model}`);
          return;
        }
      } catch (e) {}
    }
  }
  
  console.log('\nScan complete. No working combination found.');
}

bruteForce();

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const regions = [
  'us-central1', 'us-east1', 'us-east4', 'us-west1', 'us-west4',
  'europe-west1', 'europe-west2', 'europe-west3', 'europe-west4', 'europe-west9',
  'asia-northeast1', 'asia-northeast3', 'asia-southeast1'
];
const models = ['gemini-3.1-flash-lite', 'gemini-3-flash'];

async function superScan() {
  const project = process.env.VITE_GCP_PROJECT_ID;
  const tokenRes = await fetch('http://localhost:3001/token');
  const { token } = await tokenRes.json();
  
  console.log(`🚀 Starting Super Scan for project: ${project}...\n`);
  
  for (const region of regions) {
    process.stdout.write(`Checking ${region}... `);
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
          console.log(`\n\n✅ FOUND IT!`);
          console.log(`Region: ${region}`);
          console.log(`Model:  ${model}`);
          console.log(`\nAction: Update your .env to VITE_GCP_LOCATION=${region}`);
          return;
        }
      } catch (e) {}
    }
    console.log('❌');
  }
  
  console.log('\n--- SCAN FINISHED ---');
  console.log('No active region found. This usually means the project quota hasn\'t propagated yet.');
  console.log('Wait 5 minutes and try again, or check your billing status.');
}

superScan();

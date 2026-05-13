import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const locations = ['us-central1', 'us-east1', 'europe-west1'];

async function listAll() {
  const tokenRes = await fetch('http://localhost:3001/token');
  const { token } = await tokenRes.json();
  
  console.log(`Checking available publisher models...\n`);
  
  for (const loc of locations) {
    console.log(`--- Location: ${loc} ---`);
    // Unified URL for publisher models often drops the project ID or uses a different structure
    const urls = [
      `https://${loc}-aiplatform.googleapis.com/v1/projects/gapianai/locations/${loc}/publishers/google/models`,
      `https://${loc}-aiplatform.googleapis.com/v1/locations/${loc}/publishers/google/models`
    ];
    
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const text = await res.text();
        if (res.ok) {
          const data = JSON.parse(text);
          if (data.models) {
            data.models.forEach(m => {
              console.log(`- ${m.name.split('/').pop()}`);
            });
            break; // Found working URL
          }
        } else {
          console.log(`URL failed (${res.status}): ${url.slice(0, 50)}...`);
        }
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
    }
  }
}

listAll();

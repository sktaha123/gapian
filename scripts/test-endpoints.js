import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VITE_GCP_PROJECT_ID;
const location = 'us-central1';

async function testEndpoints() {
  const tokenRes = await fetch('http://localhost:3001/token');
  const { token } = await tokenRes.json();
  
  const services = ['aiplatform.googleapis.com', 'agentplatform.googleapis.com', 'generativeai.googleapis.com'];
  
  for (const s of services) {
    console.log(`Testing service: ${s}...`);
    const url = `https://${location}-${s}/v1/projects/${project}/locations/${location}/publishers/google/models`;
    
    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`- Result: ${res.status} ${res.statusText}`);
    } catch (e) {
      console.log(`- Error: ${e.message}`);
    }
  }
}

testEndpoints();

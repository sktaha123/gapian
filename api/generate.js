import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { prompt } = req.body;
    const project = process.env.VITE_GCP_PROJECT_ID;
    const location = process.env.VITE_GCP_LOCATION || 'global';
    const model = 'gemini-3.1-flash-lite';

    // 1. Authenticate using the Service Account Key from Env Variables
    const auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY),
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    // 2. Call Vertex AI
    const domain = location === 'global' ? 'aiplatform.googleapis.com' : `${location}-aiplatform.googleapis.com`;
    const url = `https://${domain}/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`;

    const vertexRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 4096,
        }
      })
    });

    const data = await vertexRes.json();
    
    if (!vertexRes.ok) throw new Error(data.error?.message || 'Vertex AI Error');

    // 3. Return the AI text to the frontend
    res.status(200).json({ 
      text: data.candidates[0].content.parts[0].text 
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

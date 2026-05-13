import express from 'express';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3002;

app.use(cors());

const auth = new GoogleAuth({
  scopes: [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/generative-language'
  ]
});

app.get('/token', async (req, res) => {
  try {
    console.log('--- Fetching GCP Access Token via ADC ---');
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;
    
    if (!token) {
      throw new Error('Failed to retrieve access token. Ensure you have run "gcloud auth application-default login".');
    }
    
    console.log('Token successfully retrieved.');
    res.json({ token });
  } catch (error) {
    console.error('Error fetching token:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`\n🚀 Vertex AI Bridge running at http://localhost:${port}`);
  console.log(`Frontend will now be able to authenticate with Vertex AI using your local GCP credentials.\n`);
});

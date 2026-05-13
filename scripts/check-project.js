import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

async function checkProject() {
  const envProject = process.env.VITE_GCP_PROJECT_ID;
  const auth = new GoogleAuth();
  
  try {
    const project = await auth.getProjectId();
    console.log(`ADC Project ID: ${project}`);
    console.log(`ENV Project ID: ${envProject}`);
    
    if (project !== envProject) {
      console.warn('⚠️ WARNING: Project ID mismatch! Your credentials are for a different project than your .env file.');
    } else {
      console.log('✅ Project IDs match.');
    }
  } catch (e) {
    console.error('Error getting Project ID from ADC:', e.message);
  }
}

checkProject();

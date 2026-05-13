import fetch from 'node-fetch';

async function testBridge() {
  console.log('Testing bridge at http://localhost:3001/token...');
  try {
    const res = await fetch('http://localhost:3001/token');
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Raw Body: ${text}`);
    
    if (res.ok) {
      const data = JSON.parse(text);
      console.log('✅ Bridge is working! Token length:', data.token?.length);
    } else {
      console.log('❌ Bridge returned an error.');
    }
  } catch (e) {
    console.error('❌ Could not connect to bridge:', e.message);
  }
}

testBridge();

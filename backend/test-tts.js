const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting edge-tts test...');
console.log('[TEST] Current directory:', process.cwd());

(async () => {
  try {
    console.log('[TEST] Importing edge-tts...');
    const { ttsSave } = await import('edge-tts/out/index.js');
    console.log('[TEST] ✓ edge-tts imported successfully');

    const testText = 'Hello, this is a test of the text to speech system';
    const testPath = path.join(process.cwd(), 'test-audio.mp3');
    
    console.log('[TEST] Generating speech...');
    console.log('[TEST] Text:', testText);
    console.log('[TEST] Output path:', testPath);
    console.log('[TEST] Voice: en-US-AnaNeural');
    
    await ttsSave(testText, testPath, { voice: 'en-US-AnaNeural' });
    
    console.log('[TEST] ✓ Speech generated');
    
    if (fs.existsSync(testPath)) {
      const stats = fs.statSync(testPath);
      console.log('[TEST] ✓ File exists');
      console.log('[TEST] File size:', stats.size, 'bytes');
    } else {
      console.log('[TEST] ❌ File does not exist');
    }

  } catch (error) {
    console.error('[TEST] ❌ Error:', error.message);
    console.error('[TEST] Stack:', error.stack);
  }
})();

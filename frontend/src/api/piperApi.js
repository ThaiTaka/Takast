/**
 * Piper TTS API Integration
 * Local TTS service using Piper engine
 */

const PIPER_API_BASE = 'http://localhost:8000';

/**
 * Generate audio using Piper TTS batch endpoint
 * @param {string} text - Text to convert to speech
 * @returns {Promise<Array>} Array of audio URLs
 */
export async function generatePiperAudio(text) {
  try {
    const response = await fetch(`${PIPER_API_BASE}/api/tts/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`Piper API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.audio_urls.map(item => ({
        url: `${PIPER_API_BASE}${item.url}`,
        text: item.text,
        index: item.index
      }));
    } else {
      throw new Error('Failed to generate audio');
    }
  } catch (error) {
    console.error('Piper TTS error:', error);
    throw error;
  }
}

/**
 * Check if Piper TTS server is available
 * @returns {Promise<boolean>}
 */
export async function checkPiperHealth() {
  try {
    const response = await fetch(`${PIPER_API_BASE}/api/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Piper health check failed:', error);
    return false;
  }
}

/**
 * Clear Piper audio cache
 * @returns {Promise<boolean>}
 */
export async function clearPiperCache() {
  try {
    const response = await fetch(`${PIPER_API_BASE}/api/cache/clear`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

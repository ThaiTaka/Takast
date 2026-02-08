/**
 * Voice Detector Utility
 * Detects and manages available speech synthesis voices
 */

/**
 * Get all available voices from browser
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export const getAllVoices = () => {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
};

/**
 * Get Vietnamese voices
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export const getVietnameseVoices = async () => {
  const allVoices = await getAllVoices();
  
  // Priority 1: Exact Vietnamese language codes
  let viVoices = allVoices.filter(voice => 
    voice.lang === 'vi-VN' || voice.lang === 'vi' || voice.lang.startsWith('vi-')
  );
  
  // Priority 2: Vietnamese in name
  if (viVoices.length === 0) {
    viVoices = allVoices.filter(voice => {
      const name = voice.name.toLowerCase();
      return name.includes('vietnamese') || name.includes('việt');
    });
  }
  
  return viVoices;
};

/**
 * Check if Vietnamese voice is available
 * @returns {Promise<boolean>}
 */
export const hasVietnameseVoice = async () => {
  const viVoices = await getVietnameseVoices();
  return viVoices.length > 0;
};

/**
 * Get best Vietnamese voice based on gender preference
 * @param {'male'|'female'} gender 
 * @returns {Promise<SpeechSynthesisVoice|null>}
 */
export const getBestVietnameseVoice = async (gender = 'female') => {
  const viVoices = await getVietnameseVoices();
  
  if (viVoices.length === 0) {
    return null;
  }
  
  let selectedVoice = null;
  
  if (gender === 'female') {
    selectedVoice = viVoices.find(voice => {
      const name = voice.name.toLowerCase();
      return name.includes('female') || name.includes('woman') || 
             name.includes('nữ') || name.includes('linh') || 
             (!name.includes('male') && !name.includes('man'));
    });
  } else {
    selectedVoice = viVoices.find(voice => {
      const name = voice.name.toLowerCase();
      return name.includes('male') || name.includes('man') || 
             name.includes('nam') || name.includes('minh');
    });
  }
  
  return selectedVoice || viVoices[0];
};

/**
 * Log all available voices to console (for debugging)
 */
export const logAvailableVoices = async () => {
  const voices = await getAllVoices();
  const viVoices = await getVietnameseVoices();
  
  console.group('🎤 Available Speech Synthesis Voices');
  console.log(`Total voices: ${voices.length}`);
  console.log(`Vietnamese voices: ${viVoices.length}`);
  
  if (viVoices.length > 0) {
    console.group('✓ Vietnamese Voices:');
    viVoices.forEach(voice => {
      console.log(`- ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
    });
    console.groupEnd();
  } else {
    console.warn('⚠️ No Vietnamese voice found!');
  }
  
  console.group('All Voices:');
  voices.forEach(voice => {
    console.log(`- ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
  });
  console.groupEnd();
  
  console.groupEnd();
};

/**
 * Get voice recommendation message
 * @returns {Promise<string>}
 */
export const getVoiceRecommendation = async () => {
  const hasVi = await hasVietnameseVoice();
  
  if (hasVi) {
    return '✓ Browser hỗ trợ giọng đọc tiếng Việt';
  } else {
    return '⚠️ Browser không hỗ trợ giọng tiếng Việt. Khuyên dùng Piper TTS để có giọng đọc tự nhiên.';
  }
};

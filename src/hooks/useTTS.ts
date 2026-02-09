import { useEffect, useState, useCallback, useRef } from 'react';
import { useAudioStore } from '@/stores/audioStore';

/**
 * Vietnamese TTS Hook - Giải quyết triệt để lỗi:
 * 1. Đọc sai ngôn ngữ (phát tiếng Anh thay vì tiếng Việt)
 * 2. Không dừng được khi pause
 */
export function useTTS() {
  const {
    isPlaying,
    isPaused,
    currentText,
    rate,
    setPlaying,
    setPaused,
    setProgress,
  } = useAudioStore();

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [vietnameseVoice, setVietnameseVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textQueueRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);

  // Khởi tạo và lấy danh sách giọng nói
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      // FIX: Tìm giọng tiếng Việt với độ ưu tiên cao
      const viVoice = findBestVietnameseVoice(voices);
      if (viVoice) {
        setVietnameseVoice(viVoice);
        console.log('✓ Found Vietnamese voice:', viVoice.name, viVoice.lang);
      } else {
        console.warn('⚠️ No Vietnamese voice found. Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      }
    };

    loadVoices();
    
    // Voices có thể load bất đồng bộ
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /**
   * FIX: Logic tìm giọng tiếng Việt chính xác
   */
  const findBestVietnameseVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    // Priority 1: Giọng có lang chính xác là vi-VN
    let voice = voices.find(v => v.lang === 'vi-VN');
    if (voice) return voice;

    // Priority 2: Giọng có lang bắt đầu bằng vi
    voice = voices.find(v => v.lang.startsWith('vi'));
    if (voice) return voice;

    // Priority 3: Giọng có tên chứa "Vietnamese" hoặc "Việt"
    voice = voices.find(v => 
      v.name.toLowerCase().includes('vietnamese') || 
      v.name.toLowerCase().includes('việt')
    );
    if (voice) return voice;

    // Fallback: Giọng mặc định (browser sẽ cố đọc theo lang được set)
    return voices[0] || null;
  };

  /**
   * Chia văn bản thành các đoạn nhỏ để tránh giới hạn của speechSynthesis
   */
  const splitText = (text: string): string[] => {
    const maxLength = 200; // Giới hạn ký tự mỗi đoạn
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    sentences.forEach(sentence => {
      if ((currentChunk + sentence).length > maxLength) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    });

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  };

  /**
   * FIX: Play function - Bắt buộc dùng giọng tiếng Việt
   */
  const play = useCallback((text?: string) => {
    if (!isSupported) {
      alert('Trình duyệt không hỗ trợ Text-to-Speech');
      return;
    }

    // Stop bất kỳ audio nào đang chạy
    cancel();

    const textToRead = text || currentText;
    if (!textToRead.trim()) return;

    // Chia văn bản thành chunks
    textQueueRef.current = splitText(textToRead);
    currentIndexRef.current = 0;

    setPlaying(true);
    setPaused(false);

    speakNextChunk();
  }, [isSupported, currentText, setPlaying, setPaused]);

  /**
   * Đọc chunk tiếp theo trong queue
   */
  const speakNextChunk = useCallback(() => {
    if (currentIndexRef.current >= textQueueRef.current.length) {
      // Đã đọc hết
      setPlaying(false);
      setProgress(100);
      return;
    }

    const chunk = textQueueRef.current[currentIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(chunk);

    // FIX: Bắt buộc set tiếng Việt
    utterance.lang = 'vi-VN';
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // FIX: Sử dụng giọng tiếng Việt đã tìm được
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onstart = () => {
      const progress = (currentIndexRef.current / textQueueRef.current.length) * 100;
      setProgress(progress);
    };

    utterance.onend = () => {
      currentIndexRef.current++;
      speakNextChunk();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      currentIndexRef.current++;
      speakNextChunk();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [vietnameseVoice, rate, setPlaying, setProgress]);

  /**
   * FIX: Pause function - Dừng NGAY LẬP TỨC
   */
  const pause = useCallback(() => {
    if (!isSupported) return;

    // FIX: Gọi nhiều lần để đảm bảo dừng
    window.speechSynthesis.pause();
    window.speechSynthesis.cancel(); // Cancel luôn để chắc chắn
    
    setPlaying(false);
    setPaused(true);
  }, [isSupported, setPlaying, setPaused]);

  /**
   * Resume function
   */
  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;

    window.speechSynthesis.resume();
    setPlaying(true);
    setPaused(false);
  }, [isSupported, isPaused, setPlaying, setPaused]);

  /**
   * FIX: Cancel function - Hủy toàn bộ hàng đợi
   */
  const cancel = useCallback(() => {
    if (!isSupported) return;

    // FIX: Dừng tất cả
    window.speechSynthesis.cancel();
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel(); // Gọi lại lần nữa

    textQueueRef.current = [];
    currentIndexRef.current = 0;
    utteranceRef.current = null;

    setPlaying(false);
    setPaused(false);
    setProgress(0);
  }, [isSupported, setPlaying, setPaused, setProgress]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    isSupported,
    availableVoices,
    vietnameseVoice,
    isPlaying,
    isPaused,
    play,
    pause,
    resume,
    cancel,
  };
}

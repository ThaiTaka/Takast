import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaMale, FaFemale, FaCog, FaHeart, FaRegHeart, FaRobot } from 'react-icons/fa';
import { getBookContent } from '../api';
import { generatePiperAudio, checkPiperHealth } from '../api/piperApi';
import { useBookStore } from '../store';
import SettingsPanel from '../components/SettingsPanel';

export default function BookReader() {
  const { filename } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [usePiperTTS, setUsePiperTTS] = useState(false);
  const [piperAvailable, setPiperAvailable] = useState(false);
  const [audioQueue, setAudioQueue] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioPlayerRef = useRef(null);
  
  const {
    isReading,
    currentLineIndex,
    voiceGender,
    readingSpeed,
    readingSettings,
    isFavorite,
    addFavorite,
    removeFavorite,
    setIsReading,
    setCurrentLineIndex,
    setVoiceGender,
    setReadingSpeed,
    resetReading
  } = useBookStore();

  const isBookFavorite = isFavorite(filename);

  const toggleFavorite = () => {
    if (isBookFavorite) {
      removeFavorite(filename);
    } else if (book) {
      addFavorite({
        filename,
        title: book.title,
        preview: book.lines.slice(0, 3).join(' ').substring(0, 200)
      });
    }
  };

  useEffect(() => {
    loadBook();
    checkPiperStatus();
    return () => {
      resetReading();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, [filename]);

  const checkPiperStatus = async () => {
    const available = await checkPiperHealth();
    setPiperAvailable(available);
    if (available) {
      console.log('✓ Piper TTS available');
    } else {
      console.log('⚠️ Piper TTS not available, using Web Speech API');
    }
  };

  const loadBook = async () => {
    setLoading(true);
    try {
      const data = await getBookContent(filename);
      setBook(data);
    } catch (error) {
      console.error('Error loading book:', error);
      alert('Không thể tải sách: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleReading = () => {
    if (isReading) {
      // Pause reading
      if (usePiperTTS && audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      } else {
        window.speechSynthesis.cancel();
      }
      setIsReading(false);
    } else {
      // Start reading
      setIsReading(true);
      if (usePiperTTS && piperAvailable) {
        readWithPiper(currentLineIndex);
      } else {
        readFromLine(currentLineIndex);
      }
    }
  };

  const readWithPiper = async (lineIndex) => {
    try {
      // Get 20 lines starting from current line
      const textChunk = book.lines.slice(lineIndex, lineIndex + 20).join(' ');
      
      if (!textChunk.trim()) {
        setIsReading(false);
        return;
      }

      // Generate audio queue
      const audioUrls = await generatePiperAudio(textChunk);
      setAudioQueue(audioUrls);
      setCurrentAudioIndex(0);

      // Start playing first audio
      if (audioUrls.length > 0 && audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrls[0].url;
        audioPlayerRef.current.play();
      }
    } catch (error) {
      console.error('Piper TTS error:', error);
      alert('Lỗi Piper TTS. Chuyển sang Web Speech API...');
      setUsePiperTTS(false);
      readFromLine(lineIndex);
    }
  };

  const handleAudioEnded = () => {
    if (currentAudioIndex < audioQueue.length - 1) {
      // Play next audio
      const nextIndex = currentAudioIndex + 1;
      setCurrentAudioIndex(nextIndex);
      
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioQueue[nextIndex].url;
        audioPlayerRef.current.play();
      }
    } else {
      // Finished current chunk, load next
      const newLineIndex = currentLineIndex + 20;
      if (newLineIndex < book.lines.length) {
        setCurrentLineIndex(newLineIndex);
        readWithPiper(newLineIndex);
      } else {
        setIsReading(false);
      }
    }
  };


  const readFromLine = (lineIndex) => {
    if (!book || lineIndex >= book.lines.length) {
      setIsReading(false);
      return;
    }

    const line = book.lines[lineIndex].trim();
    if (!line) {
      // Skip empty lines
      setCurrentLineIndex(lineIndex + 1);
      setTimeout(() => readFromLine(lineIndex + 1), 100);
      return;
    }

    // Scroll to current line
    const lineElement = document.getElementById(`line-${lineIndex}`);
    if (lineElement) {
      lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = 'vi-VN';
    utterance.rate = readingSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Get voices
    const voices = window.speechSynthesis.getVoices();
    const viVoices = voices.filter(voice => 
      voice.lang.startsWith('vi') || voice.lang.startsWith('en')
    );
    
    if (viVoices.length > 0) {
      let selectedVoice = null;
      
      if (voiceGender === 'female') {
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
      
      utterance.voice = selectedVoice || viVoices[0];
    }

    utterance.onstart = () => {
      setCurrentLineIndex(lineIndex);
    };

    utterance.onend = () => {
      if (isReading) {
        const nextIndex = lineIndex + 1;
        if (nextIndex < book.lines.length) {
          setTimeout(() => readFromLine(nextIndex), 400);
        } else {
          setIsReading(false);
          alert('Đã đọc hết sách! 📚✨');
        }
      }
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      if (isReading) {
        const nextIndex = lineIndex + 1;
        if (nextIndex < book.lines.length) {
          setTimeout(() => readFromLine(nextIndex), 500);
        } else {
          setIsReading(false);
        }
      }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleLineClick = (index) => {
    setCurrentLineIndex(index);
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(true);
      readFromLine(index);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Đang tải sách...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy sách</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-500"
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-full transition-all"
              title="Cài đặt đọc sách"
            >
              <FaCog className="text-xl" />
            </button>
            
            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
              title={isBookFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              {isBookFavorite ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-xl hover:text-red-500" />
              )}
            </button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
        <p className="text-gray-600">Tổng số dòng: {book.total_lines}</p>
      </div>

      {/* Reading Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4 z-10">
        {/* TTS Engine Selector */}
        {piperAvailable && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">TTS Engine:</span>
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ttsEngine"
                    checked={!usePiperTTS}
                    onChange={() => setUsePiperTTS(false)}
                    className="text-primary-500"
                  />
                  <span className="text-sm">Web Speech API</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ttsEngine"
                    checked={usePiperTTS}
                    onChange={() => setUsePiperTTS(true)}
                    className="text-primary-500"
                  />
                  <span className="text-sm font-semibold text-blue-600">Piper TTS ⚡</span>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleReading}
              className={`p-4 rounded-full shadow-lg transition-all ${
                isReading
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-primary-500 hover:bg-primary-600'
              }`}
            >
              {isReading ? (
                <FaPause className="text-white text-xl" />
              ) : (
                <FaPlay className="text-white text-xl" />
              )}
            </button>
            
            <div>
              <p className="font-semibold text-gray-800">
                {isReading ? 'Đang đọc...' : 'Nhấn để bắt đầu đọc'}
              </p>
              <p className="text-sm text-gray-600">
                Dòng {currentLineIndex + 1} / {book.total_lines}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <FaVolumeUp className="text-gray-600 text-xl" />
            
            {/* Voice Gender Selection */}
            <button
              onClick={() => setVoiceGender('female')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                voiceGender === 'female'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaFemale />
              <span>Giọng nữ</span>
            </button>
            <button
              onClick={() => setVoiceGender('male')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                voiceGender === 'male'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaMale />
              <span>Giọng nam</span>
            </button>
            
            {/* Reading Speed Control */}
            <div className="flex flex-col items-center space-y-1 ml-4">
              <label className="text-sm text-gray-600">Tốc độ</label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Chậm</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={readingSpeed}
                  onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
                  className="w-24"
                  title={`Tốc độ: ${readingSpeed}x`}
                />
                <span className="text-xs text-gray-500">Nhanh</span>
                <span className="text-sm font-semibold text-primary-600 min-w-[3rem]">
                  {readingSpeed}x
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Content */}
      <div 
        className={`rounded-lg shadow-md p-8 transition-colors ${
          readingSettings.theme === 'dark' ? 'bg-gray-900' : 
          readingSettings.theme === 'sepia' ? 'bg-amber-50' : 'bg-white'
        }`}
      >
        <div className="prose max-w-none">
          {book.lines.map((line, index) => (
            <p
              key={index}
              id={`line-${index}`}
              className={`reading-line cursor-pointer mb-2 transition-all duration-300 ${
                index === currentLineIndex && isReading 
                  ? 'active font-semibold' 
                  : ''
              }`}
              style={{
                fontSize: `${readingSettings.fontSize}px`,
                color: readingSettings.fontColor,
                backgroundColor: index === currentLineIndex && isReading 
                  ? readingSettings.highlightColor 
                  : 'transparent',
                padding: index === currentLineIndex && isReading ? '8px' : '0',
                borderRadius: '4px'
              }}
              onClick={() => handleLineClick(index)}
              title="Click để nhảy đến dòng này"
            >
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>

      {/* Hidden audio player for Piper TTS */}
      <audio
        ref={audioPlayerRef}
        onEnded={handleAudioEnded}
        onError={(e) => {
          console.error('Audio playback error:', e);
          setIsReading(false);
        }}
        style={{ display: 'none' }}
      />

      {/* Settings Panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

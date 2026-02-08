import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

export default function VoiceSearch({ onSearch }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'vi-VN';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          onSearch(transcriptText);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSearch]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <button
        onClick={toggleListening}
        className={`relative p-6 rounded-full shadow-lg transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-primary-500 hover:bg-primary-600'
        }`}
        title={isListening ? 'Nhấn để dừng' : 'Nhấn để tìm kiếm bằng giọng nói'}
      >
        {isListening ? (
          <FaStop className="text-white text-3xl" />
        ) : (
          <FaMicrophone className="text-white text-3xl" />
        )}
        
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>
      
      {transcript && (
        <div className="bg-white px-4 py-2 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-600">Đang nghe:</p>
          <p className="font-medium text-gray-800">{transcript}</p>
        </div>
      )}
      
      <p className="text-sm text-gray-600 text-center max-w-xs">
        {isListening
          ? 'Đang lắng nghe... Hãy nói tên sách hoặc nội dung bạn muốn tìm'
          : 'Nhấn vào micro để tìm kiếm bằng giọng nói'}
      </p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { FaMicrophone, FaRobot, FaPlay } from 'react-icons/fa';
import { trainTTS, getAvailableVoices } from '../api';

export default function TTSTraining({ socket }) {
  const [training, setTraining] = useState(false);
  const [voices, setVoices] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadVoices();

    socket.on('tts_training_complete', (data) => {
      alert('TTS Training hoàn thành! ' + data.message);
      setTraining(false);
      loadVoices();
    });

    socket.on('tts_training_error', (data) => {
      alert('Lỗi khi training TTS: ' + data.error);
      setTraining(false);
    });

    return () => {
      socket.off('tts_training_complete');
      socket.off('tts_training_error');
    };
  }, [socket]);

  const loadVoices = async () => {
    try {
      const data = await getAvailableVoices();
      setVoices(data.voices?.voices || []);
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  };

  const handleStartTraining = async () => {
    try {
      setTraining(true);
      await trainTTS();
      alert('Đã bắt đầu training TTS từ VietSpeech dataset!');
    } catch (error) {
      alert('Lỗi khi bắt đầu training: ' + error.message);
      setTraining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <FaMicrophone className="text-primary-500 text-6xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Vietnamese TTS Training
          </h2>
          <p className="text-gray-600">
            Train giọng nói tiếng Việt từ VietSpeech dataset
          </p>
        </div>

        {/* Available Voices */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Giọng nói hiện có:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voices.map((voice, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <p className="font-semibold text-gray-800">{voice.name}</p>
                <p className="text-sm text-gray-600">Language: {voice.language}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dataset Info */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Dataset: VietSpeech</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>✓ Speaker: VIVOSSPK01 (Female), VIVOSSPK02 (Male)</li>
            <li>✓ Sample Rate: 16kHz</li>
            <li>✓ Language: Vietnamese</li>
            <li>✓ Source: Hugging Face (NhutP/VietSpeech)</li>
          </ul>
        </div>

        {/* Training Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleStartTraining}
            disabled={training}
            className="flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlay />
            <span>{training ? 'Đang training...' : 'Bắt đầu Training TTS'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-3">📋 Hướng dẫn:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">1.</span>
              <span>
                Click <strong>"Bắt đầu Training TTS"</strong> để tải và xử lý VietSpeech dataset
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">2.</span>
              <span>
                Model sẽ học giọng nói tiếng Việt từ dataset thực tế
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">3.</span>
              <span>
                Sau khi training xong, giọng đọc sách sẽ là giọng tiếng Việt chuẩn
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">4.</span>
              <span>
                Hỗ trợ cả giọng nam và giọng nữ
              </span>
            </li>
          </ul>
        </div>

        {/* Technical Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🎤 Dataset: VietSpeech (Hugging Face)</p>
          <p>🔊 Engine: gTTS + Custom Vietnamese TTS</p>
          <p>📊 Quality: High-quality Vietnamese speech</p>
        </div>
      </div>
    </div>
  );
}

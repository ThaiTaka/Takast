'use client';

import { useTTS } from '@/hooks/useTTS';
import { useAudioStore } from '@/stores/audioStore';
import { useEffect } from 'react';

export default function AudioPlayer() {
  const { 
    isPlaying, 
    isPaused, 
    currentChapterId, 
    progress, 
    rate, 
    setRate,
    reset 
  } = useAudioStore();
  
  const {
    isSupported,
    vietnameseVoice,
    play,
    pause,
    resume,
    cancel,
  } = useTTS();

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    }
  };

  const handleStop = () => {
    cancel();
    reset();
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    // Nếu đang play, cần restart với rate mới
    if (isPlaying) {
      cancel();
      // Sẽ tự động play lại từ store
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-red-100 border-t-4 border-red-500 p-4 text-center">
        <p className="text-red-800 font-semibold">
          ⚠️ Trình duyệt không hỗ trợ Text-to-Speech
        </p>
      </div>
    );
  }

  if (!currentChapterId) {
    return null; // Không hiển thị player nếu chưa chọn chương
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Voice Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 truncate">
              {vietnameseVoice ? (
                <>
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Giọng đọc: <strong className="ml-1">{vietnameseVoice.name}</strong>
                  </span>
                </>
              ) : (
                <span className="text-yellow-600">⚠️ Không tìm thấy giọng tiếng Việt</span>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Speed Control */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Tốc độ:</label>
              <select
                value={rate}
                onChange={(e) => handleRateChange(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2.0}>2.0x</option>
              </select>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {isPlaying ? '⏸️ Pause' : isPaused ? '▶️ Resume' : '▶️ Play'}
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStop}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ⏹️ Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

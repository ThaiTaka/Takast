import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRobot, FaCheckCircle } from 'react-icons/fa';
import { startTraining, pauseTraining, getTrainingStatus } from '../api';
import { useBookStore } from '../store';

export default function Training({ socket }) {
  const [localStatus, setLocalStatus] = useState(null);
  const { trainingStatus, setTrainingStatus } = useBookStore();

  useEffect(() => {
    // Load initial status
    loadStatus();

    // Listen to socket events
    socket.on('training_status', (status) => {
      setTrainingStatus(status);
      setLocalStatus(status);
    });

    socket.on('training_complete', (data) => {
      alert('Training hoàn thành! ' + data.message);
      loadStatus();
    });

    socket.on('training_error', (data) => {
      alert('Lỗi khi training: ' + data.error);
      loadStatus();
    });

    // Request status updates every 2 seconds when training
    const interval = setInterval(() => {
      if (localStatus?.is_training) {
        socket.emit('request_training_status');
      }
    }, 2000);

    return () => {
      socket.off('training_status');
      socket.off('training_complete');
      socket.off('training_error');
      clearInterval(interval);
    };
  }, [socket, localStatus]);

  const loadStatus = async () => {
    try {
      const data = await getTrainingStatus();
      setTrainingStatus(data.status);
      setLocalStatus(data.status);
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  const handleStartTraining = async () => {
    try {
      await startTraining();
      alert('Đã bắt đầu training!');
      setTimeout(loadStatus, 1000);
    } catch (error) {
      alert('Lỗi khi bắt đầu training: ' + error.message);
    }
  };

  const handlePauseTraining = async () => {
    try {
      await pauseTraining();
      alert('Đã tạm dừng training!');
      setTimeout(loadStatus, 1000);
    } catch (error) {
      alert('Lỗi khi tạm dừng training: ' + error.message);
    }
  };

  const status = localStatus || trainingStatus;
  const progress = status.progress || 0;
  const isTraining = status.is_training || false;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <FaRobot className="text-primary-500 text-6xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            AI Model Training
          </h2>
          <p className="text-gray-600">
            Train AI để tìm kiếm thông minh hơn 10,000 cuốn sách
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              <p className="text-lg font-semibold text-gray-800">
                {isTraining ? (
                  <span className="text-green-600">🔄 Đang training</span>
                ) : progress >= 99 ? (
                  <span className="text-blue-600">✅ Hoàn thành</span>
                ) : (
                  <span className="text-gray-600">⏸️ Tạm dừng</span>
                )}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Tiến độ</p>
              <p className="text-2xl font-bold text-primary-600">
                {progress.toFixed(1)}%
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Đã xử lý</p>
              <p className="text-lg font-semibold text-gray-800">
                {status.current_index} / {status.total_books || 0}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <div className="h-full flex items-center justify-center text-xs text-white font-semibold">
                  {progress.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Embeddings Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Embeddings đã tạo:</strong> {status.embeddings_count || 0}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Model sử dụng: Vietnamese SBERT (keepitreal/vietnamese-sbert)
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isTraining ? (
            <button
              onClick={handleStartTraining}
              className="flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg"
            >
              <FaPlay />
              <span>{progress > 0 ? 'Tiếp tục Training' : 'Bắt đầu Training'}</span>
            </button>
          ) : (
            <button
              onClick={handlePauseTraining}
              className="flex items-center justify-center space-x-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg"
            >
              <FaPause />
              <span>Tạm dừng Training</span>
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-3">📋 Hướng dẫn:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">1.</span>
              <span>
                Nhấn <strong>"Bắt đầu Training"</strong> để AI bắt đầu học hơn 10,000 cuốn sách
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">2.</span>
              <span>
                Bạn có thể <strong>"Tạm dừng"</strong> bất cứ lúc nào, dữ liệu sẽ được lưu tự động
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">3.</span>
              <span>
                Nhấn <strong>"Tiếp tục Training"</strong> để train tiếp từ nơi đã dừng
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">4.</span>
              <span>
                Sau khi hoàn thành, tính năng tìm kiếm thông minh sẽ hoạt động tốt nhất
              </span>
            </li>
          </ul>
        </div>

        {/* Technical Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>⚡ Checkpoint tự động lưu mỗi 50 sách</p>
          <p>💾 Dữ liệu được lưu trong thư mục: data/checkpoints</p>
        </div>
      </div>
    </div>
  );
}

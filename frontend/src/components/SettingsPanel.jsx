import { useBookStore } from '../store';
import { FaCog, FaFont, FaPalette, FaSun, FaMoon } from 'react-icons/fa';

export default function SettingsPanel({ isOpen, onClose }) {
  const { 
    readingSettings, 
    setFontSize, 
    setFontColor, 
    setHighlightColor, 
    setTheme 
  } = useBookStore();

  const themes = [
    { name: 'light', label: 'Sáng', icon: FaSun, bg: 'bg-white', text: 'text-gray-900' },
    { name: 'dark', label: 'Tối', icon: FaMoon, bg: 'bg-gray-900', text: 'text-white' },
    { name: 'sepia', label: 'Sepia', icon: FaFont, bg: 'bg-amber-50', text: 'text-amber-900' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaCog className="text-primary-500 text-2xl" />
            <h2 className="text-xl font-bold text-gray-800">Cài đặt đọc sách</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <FaFont className="text-primary-500" />
                <span>Cỡ chữ</span>
              </label>
              <span className="text-sm text-gray-600">{readingSettings.fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="32"
              value={readingSettings.fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>32px</span>
            </div>
            
            {/* Preview */}
            <div 
              className="mt-3 p-3 bg-gray-50 rounded border border-gray-200"
              style={{ fontSize: `${readingSettings.fontSize}px` }}
            >
              Đây là mẫu chữ hiển thị
            </div>
          </div>

          {/* Font Color */}
          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-3">
              <FaPalette className="text-primary-500" />
              <span>Màu chữ</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={readingSettings.fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={readingSettings.fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Highlight Color */}
          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-3">
              <FaPalette className="text-primary-500" />
              <span>Màu highlight</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={readingSettings.highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={readingSettings.highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="#FFFF00"
              />
            </div>
            
            {/* Preview */}
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <span 
                className="px-2 py-1 rounded"
                style={{ backgroundColor: readingSettings.highlightColor }}
              >
                Văn bản được highlight
              </span>
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-3">
              <FaSun className="text-primary-500" />
              <span>Chế độ nền</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = readingSettings.theme === theme.name;
                
                return (
                  <button
                    key={theme.name}
                    onClick={() => setTheme(theme.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isActive 
                        ? 'border-primary-500 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`${theme.bg} ${theme.text} p-3 rounded mb-2 flex items-center justify-center`}>
                      <Icon className="text-2xl" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">{theme.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t">
            <button
              onClick={() => {
                setFontSize(18);
                setFontColor('#000000');
                setHighlightColor('#FFFF00');
                setTheme('light');
              }}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Đặt lại mặc định
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}

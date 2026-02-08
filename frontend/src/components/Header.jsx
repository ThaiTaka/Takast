import { Link } from 'react-router-dom';
import { FaBook, FaRobot } from 'react-icons/fa';
import { MdWifi, MdWifiOff } from 'react-icons/md';

export default function Header({ socketConnected }) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <FaBook className="text-primary-500 text-3xl" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Thư Viện Sách Việt Nam
              </h1>
              <p className="text-sm text-gray-500">10,000+ cuốn sách</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
            >
              Trang chủ
            </Link>
            <Link 
              to="/favorites" 
              className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
            >
              Sách yêu thích
            </Link>
            
            <div className="flex items-center space-x-2">
              {socketConnected ? (
                <MdWifi className="text-green-500 text-xl" title="Đã kết nối" />
              ) : (
                <MdWifiOff className="text-red-500 text-xl" title="Mất kết nối" />
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

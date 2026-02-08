import { Link } from 'react-router-dom';
import { FaBook, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useBookStore } from '../store';

export default function BookCard({ book }) {
  const { title, preview, similarity_score, filename } = book;
  const { isFavorite, addFavorite, removeFavorite } = useBookStore();
  
  const isBookFavorite = isFavorite(filename);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookFavorite) {
      removeFavorite(filename);
    } else {
      addFavorite(book);
    }
  };
  
  return (
    <Link to={`/book/${encodeURIComponent(filename)}`}>
      <div className="book-card relative">
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all group"
          title={isBookFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          {isBookFavorite ? (
            <FaHeart className="text-red-500 text-lg group-hover:scale-110 transition-transform" />
          ) : (
            <FaRegHeart className="text-gray-400 text-lg group-hover:text-red-500 group-hover:scale-110 transition-all" />
          )}
        </button>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-md shadow-md flex items-center justify-center">
              <FaBook className="text-white text-2xl" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0 pr-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {title}
            </h3>
            
            {preview && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                {preview}
              </p>
            )}
            
            {similarity_score !== undefined && (
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <span className="text-sm text-gray-500">
                  Độ liên quan: {(similarity_score * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

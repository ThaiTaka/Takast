import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../store';
import { FaHeart, FaBook, FaSearch, FaTimes } from 'react-icons/fa';

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useBookStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter favorites
  const filteredFavorites = favorites.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (book.summary && book.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter logic (can be enhanced based on book metadata)
    const matchesCategory = categoryFilter === 'all' || 
                          (book.category && book.category === categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  const handleRemoveFavorite = (e, filename) => {
    e.stopPropagation();
    removeFavorite(filename);
  };

  const handleBookClick = (filename) => {
    navigate(`/book/${encodeURIComponent(filename)}`);
  };

  // Get unique categories from favorites
  const categories = ['all', ...new Set(favorites.map(b => b.category).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FaHeart className="text-red-500 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800">Sách Yêu Thích</h1>
        </div>
        <p className="text-gray-600">
          Bạn có {favorites.length} cuốn sách yêu thích
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <FaHeart className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-400 mb-2">
            Chưa có sách yêu thích
          </h2>
          <p className="text-gray-500 mb-6">
            Thêm sách vào danh sách yêu thích để đọc sau
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Khám phá sách
          </button>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm trong sách yêu thích..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Category Filter */}
            {categories.length > 1 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Tất cả thể loại' : cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Results count */}
          {searchQuery && (
            <p className="text-sm text-gray-600 mb-4">
              Tìm thấy {filteredFavorites.length} kết quả
            </p>
          )}

          {/* Books Grid */}
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy sách phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFavorites.map((book) => (
                <div
                  key={book.filename}
                  onClick={() => handleBookClick(book.filename)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  {/* Book Cover */}
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative">
                    <FaBook className="text-white text-6xl opacity-80 group-hover:scale-110 transition-transform" />
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemoveFavorite(e, book.filename)}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="Xóa khỏi yêu thích"
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>

                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {book.title}
                    </h3>
                    
                    {book.summary && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {book.summary}
                      </p>
                    )}
                    
                    {book.category && (
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {book.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

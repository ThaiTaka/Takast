import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { searchBooks, listBooks } from '../api';
import { useBookStore } from '../store';
import BookCard from '../components/BookCard';
import VoiceSearch from '../components/VoiceSearch';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'browse'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { searchResults, setSearchResults, books, setBooks } = useBookStore();

  useEffect(() => {
    if (activeTab === 'browse') {
      loadBooks(page);
    }
  }, [page, activeTab]);

  const loadBooks = async (pageNum) => {
    setLoading(true);
    try {
      const data = await listBooks(pageNum, 50);
      setBooks(data.books);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    const queryText = searchQuery || query;
    if (!queryText.trim()) return;

    setLoading(true);
    try {
      const data = await searchBooks(queryText, 20);
      setSearchResults(data.results);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching:', error);
      alert('Lỗi khi tìm kiếm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearch = (transcript) => {
    setQuery(transcript);
    handleSearch(transcript);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Khám Phá Kho Tàng Sách Việt
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Tìm kiếm, đọc và nghe hơn 10,000 cuốn sách tiếng Việt với công nghệ AI
        </p>
      </div>

      {/* Voice Search */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Tìm Kiếm Bằng Giọng Nói
        </h3>
        <div className="flex justify-center">
          <VoiceSearch onSearch={handleVoiceSearch} />
        </div>
      </div>

      {/* Text Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Nhập tên sách hoặc nội dung bạn muốn tìm..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-primary px-8 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Kết quả tìm kiếm ({searchResults.length})
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'browse'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Duyệt sách
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      ) : (
        <>
          {activeTab === 'search' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.length > 0 ? (
                searchResults.map((book, index) => (
                  <BookCard key={index} book={book} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500 text-lg">
                    Chưa có kết quả tìm kiếm. Hãy thử tìm kiếm hoặc sử dụng giọng nói!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'browse' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {books.map((book, index) => (
                  <BookCard key={index} book={book} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Trang trước
                  </button>
                  <span className="text-gray-700 font-medium">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

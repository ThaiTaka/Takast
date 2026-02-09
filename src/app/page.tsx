export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Takash</h1>
          <nav className="flex items-center space-x-6">
            <a href="/books" className="text-gray-700 hover:text-blue-600">
              Thư viện
            </a>
            <a href="/studio" className="text-gray-700 hover:text-blue-600">
              Studio
            </a>
            <a href="/auth/signin" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Đăng nhập
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Nền tảng Đọc & Sáng tác truyện
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Đọc truyện với giọng đọc AI tiếng Việt tự nhiên. Viết và xuất bản truyện của bạn với công cụ soạn thảo hiện đại.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Đọc truyện</h3>
            <p className="text-gray-600">
              Hàng ngàn truyện hay với giao diện đọc tối giản, dễ chịu cho mắt
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-bold mb-2">Nghe đọc AI</h3>
            <p className="text-gray-600">
              Giọng đọc tiếng Việt tự nhiên, tốc độ tùy chỉnh
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-bold mb-2">Viết truyện</h3>
            <p className="text-gray-600">
              Công cụ soạn thảo mạnh mẽ với tự động lưu
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBookStore = create(
  persist(
    (set, get) => ({
      // Books state
      books: [],
      selectedBook: null,
      searchResults: [],
      
      // Favorites state
      favorites: [],
      
      // Reading settings
      readingSettings: {
        fontSize: 18,
        fontColor: '#000000',
        highlightColor: '#FFFF00',
        theme: 'light' // 'light', 'dark', 'sepia'
      },
      
      // Training state
      trainingStatus: {
        is_training: false,
        progress: 0,
        current_index: 0,
        total_books: 0,
        embeddings_count: 0
      },
      
      // Reading state
      isReading: false,
      currentLineIndex: 0,
      voiceGender: 'female', // 'male' or 'female'
      readingSpeed: 0.95, // 0.5 to 2.0
      
      // Voice search state
      isListening: false,
      voiceQuery: '',
      
      // Actions
      setBooks: (books) => set({ books }),
      setSelectedBook: (book) => set({ selectedBook: book }),
      setSearchResults: (results) => set({ searchResults: results }),
      setTrainingStatus: (status) => set({ trainingStatus: status }),
      setIsReading: (isReading) => set({ isReading }),
      setCurrentLineIndex: (index) => set({ currentLineIndex: index }),
      setVoiceGender: (gender) => set({ voiceGender: gender }),
      setReadingSpeed: (speed) => set({ readingSpeed: speed }),
      setIsListening: (isListening) => set({ isListening }),
      setVoiceQuery: (query) => set({ voiceQuery: query }),
      
      // Favorites actions
      addFavorite: (book) => set((state) => {
        const exists = state.favorites.some(fav => fav.filename === book.filename);
        if (exists) return state;
        return { favorites: [...state.favorites, book] };
      }),
      
      removeFavorite: (filename) => set((state) => ({
        favorites: state.favorites.filter(book => book.filename !== filename)
      })),
      
      isFavorite: (filename) => {
        const state = get();
        return state.favorites.some(fav => fav.filename === filename);
      },
      
      // Reading settings actions
      updateReadingSettings: (settings) => set((state) => ({
        readingSettings: { ...state.readingSettings, ...settings }
      })),
      
      setFontSize: (size) => set((state) => ({
        readingSettings: { ...state.readingSettings, fontSize: size }
      })),
      
      setFontColor: (color) => set((state) => ({
        readingSettings: { ...state.readingSettings, fontColor: color }
      })),
      
      setHighlightColor: (color) => set((state) => ({
        readingSettings: { ...state.readingSettings, highlightColor: color }
      })),
      
      setTheme: (theme) => set((state) => ({
        readingSettings: { ...state.readingSettings, theme }
      })),
      
      // Reset reading
      resetReading: () => set({ isReading: false, currentLineIndex: 0 }),
    }),
    {
      name: 'bookweb-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        readingSettings: state.readingSettings,
        voiceGender: state.voiceGender,
        readingSpeed: state.readingSpeed
      })
    }
  )
);

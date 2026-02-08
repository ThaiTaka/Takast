import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import BookReader from './pages/BookReader';
import Favorites from './pages/Favorites';
import { io } from 'socket.io-client';

// Socket connection
const socket = io('http://localhost:5000');

function App() {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setSocketConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Header socketConnected={socketConnected} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home socket={socket} />} />
            <Route path="/book/:filename" element={<BookReader />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { AddAlbum } from './components/AddAlbum';
import { AddImage } from './components/AddImage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'add-album' | 'add-image'>('home');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page: 'home' | 'add-album' | 'add-image') => {
    setCurrentPage(page);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <Header
        username={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      {currentPage === 'home' && <Gallery />}
      {currentPage === 'add-album' && <AddAlbum username={currentUser} />}
      {currentPage === 'add-image' && <AddImage username={currentUser} />}
    </div>
  );
}
import { Button } from './ui/button';
import { Home, FolderPlus, Upload, LogOut, ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface HeaderProps {
  username: string;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'add-album' | 'add-image') => void;
  currentPage: string;
}

export function Header({ username, onLogout, onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FrontX
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant={currentPage === 'home' ? 'default' : 'ghost'}
                onClick={() => onNavigate('home')}
                className={currentPage === 'home' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                variant={currentPage === 'add-album' ? 'default' : 'ghost'}
                onClick={() => onNavigate('add-album')}
                className={currentPage === 'add-album' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Album
              </Button>
              <Button
                variant={currentPage === 'add-image' ? 'default' : 'ghost'}
                onClick={() => onNavigate('add-image')}
                className={currentPage === 'add-image' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </nav>
          </div>

          {/* User section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Avatar className="w-9 h-9 border-2 border-purple-200">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="border-gray-300">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-2 mt-4 overflow-x-auto pb-2">
          <Button
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('home')}
            className={currentPage === 'home' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant={currentPage === 'add-album' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('add-album')}
            className={currentPage === 'add-album' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Album
          </Button>
          <Button
            variant={currentPage === 'add-image' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('add-image')}
            className={currentPage === 'add-image' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </nav>
      </div>
    </header>
  );
}
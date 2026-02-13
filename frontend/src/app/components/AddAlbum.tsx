import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { FolderPlus, CheckCircle, Trash2, FolderOpen } from 'lucide-react';
import { albumsAPI } from '../../services/api';

interface Album {
  _id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
}

interface AddAlbumProps {
  username: string;
}

export function AddAlbum({ username }: AddAlbumProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);

  useEffect(() => {
    loadUserAlbums();
  }, []);

  const loadUserAlbums = async () => {
    try {
      const albums: Album[] = await albumsAPI.getAll();
      const sorted = albums.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setUserAlbums(sorted);
    } catch (err: any) {
      console.error('Failed to load albums:', err);
      alert(err.message || 'Failed to load albums');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert('Please enter album title');
      return;
    }

    try {
      await albumsAPI.create({ title, description });
      setShowSuccess(true);
      setTitle('');
      setDescription('');
      await loadUserAlbums();

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to create album:', err);
      alert(err.message || 'Failed to create album');
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this album? Images in this album will NOT be deleted.'
      )
    ) {
      return;
    }

    try {
      await albumsAPI.delete(albumId);
      await loadUserAlbums();
    } catch (err: any) {
      console.error('Failed to delete album:', err);
      alert(err.message || 'Failed to delete album');
    }
  };

  // временно заглушка — пока AddImage не переведён на API
  const getImageCount = (albumId: string) => {
    return 0;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <FolderPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl mb-2">Create New Album</h2>
          <p className="text-gray-600">Organize your images into collections</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Album Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle>Album Details</CardTitle>
              <CardDescription>
                Give your album a name and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Album Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Travel Adventures, Design Inspiration"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us more about this album..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {showSuccess && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">
                      Album created successfully!
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create Album
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Your Albums List */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle>Your Albums</CardTitle>
              <CardDescription>
                {userAlbums.length}{' '}
                {userAlbums.length === 1 ? 'album' : 'albums'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userAlbums.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 text-sm">No albums yet</p>
                  <p className="text-gray-400 text-xs">
                    Create your first album
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {userAlbums.map((album) => (
                    <div
                      key={album._id}
                      className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FolderOpen className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <h3 className="font-medium truncate">
                              {album.title}
                            </h3>
                          </div>
                          {album.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {album.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {getImageCount(album._id)}{' '}
                            {getImageCount(album._id) === 1 ? 'image' : 'images'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDeleteAlbum(album._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

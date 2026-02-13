import { useState, useEffect, useMemo } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Dialog, DialogContent } from './ui/dialog';
import { X, Calendar, FolderOpen, Filter, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { albumsAPI, photosAPI } from '../../services/api';

interface Image {
  id: string;
  url: string;
  title: string;
  description: string;
  username: string;
  albumId: string | null;
  createdAt: string;
}

interface Album {
  id: string;
  title: string;
  description: string;
  username: string;
}

export function Gallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser') || '';
    setCurrentUser(user);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allImagesFromApi, allAlbumsFromApi] = await Promise.all([
        photosAPI.getAll(),
        albumsAPI.getAll(),
      ]);

      const normalizedImages: Image[] = allImagesFromApi.map((p: any) => ({
        id: p._id,
        url: p.imageUrl,
        title: p.title,
        description: p.description || '',
        username: p.username || 'Unknown',
        albumId: p.albumId || null,
        createdAt: p.createdAt,
      }));

      const normalizedAlbums: Album[] = allAlbumsFromApi.map((a: any) => ({
        id: a._id,
        title: a.title,
        description: a.description || '',
        username: a.username || 'Unknown',
      }));

      const sortedImages = normalizedImages.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setImages(sortedImages);
      setAlbums(normalizedAlbums);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = useMemo(() => {
    if (selectedAlbum === 'all') return images;
    if (selectedAlbum === 'my-images') {
      return images.filter((img) => img.username === currentUser);
    }
    return images.filter((img) => img.albumId === selectedAlbum);
  }, [images, selectedAlbum, currentUser]);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedImage(null), 200);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await photosAPI.delete(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      handleClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete image');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAlbumName = (albumId: string | null) => {
    if (!albumId) return null;
    const album = albums.find((a) => a.id === albumId);
    return album?.title || null;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-gray-500">
        Loading images...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-200 to-blue-200 rounded-3xl mb-6">
            <FolderOpen className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl text-gray-700 mb-3">No images yet</h2>
          <p className="text-gray-500 text-lg mb-6">
            Start building your collection by uploading your first image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header + Filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl mb-2">Explore</h2>
            <p className="text-gray-600">
              {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Filter by album" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                <SelectItem value="my-images">My Images</SelectItem>
                {albums.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 border-t mt-1">
                      ALBUMS
                    </div>
                    {albums.map((album) => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.title}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Images */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No images found with this filter
          </div>
        ) : (
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}>
            <Masonry gutter="20px">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/400x600?text=Error+Loading+Image';
                    }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                    <h3 className="text-white text-lg mb-2 line-clamp-2">{image.title}</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6 border border-white/50">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs">
                          {image.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white/90 text-sm">{image.username}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}

        {/* Modal */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-transparent border-0">
            {selectedImage && (
              <div className="grid md:grid-cols-[1fr_400px] bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh]">
                <div className="relative bg-black flex itemsCentered justify-center">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[90vh] object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/800x600?text=Error+Loading+Image';
                    }}
                  />
                  <button
                    onClick={handleClose}
                    className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="bg-white overflow-y-auto">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-purple-200">
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                            {selectedImage.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedImage.username}</p>
                          <p className="text-sm text-gray-500">Creator</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl mb-3">{selectedImage.title}</h2>
                      {selectedImage.description && (
                        <p className="text-gray-600 leading-relaxed">
                          {selectedImage.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Posted on {formatDate(selectedImage.createdAt)}</span>
                      </div>
                      {selectedImage.albumId && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <FolderOpen className="w-4 h-4" />
                          <span>Album: {getAlbumName(selectedImage.albumId)}</span>
                        </div>
                      )}
                    </div>

                    {selectedImage.username === currentUser && (
                      <div className="pt-4 border-t">
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDeleteImage(selectedImage.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

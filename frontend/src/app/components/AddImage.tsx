import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, CheckCircle, Link } from 'lucide-react';
import { albumsAPI, photosAPI } from '../../services/api';

interface Album {
  _id: string;
  title: string;
  description?: string;
  userId: string;
}

interface AddImageProps {
  username: string;
}

export function AddImage({ username }: AddImageProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const data: Album[] = await albumsAPI.getAll();
      setAlbums(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to load albums');
    }
  };

  useEffect(() => {
    if (url) {
      const timer = setTimeout(() => {
        setPreviewUrl(url);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setPreviewUrl('');
    }
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert('Please enter a title');
      return;
    }

    if (!url) {
      alert('Please enter an image URL');
      return;
    }

    if (!albumId || albumId === 'none') {
      alert('Please select an album');
      return;
    }

    try {
      await photosAPI.create({
        title,
        description,
        imageUrl: url, // только URL
        albumId,
      });

      setShowSuccess(true);
      setUrl('');
      setTitle('');
      setDescription('');
      setAlbumId('');
      setPreviewUrl('');

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to upload image');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl mb-2">Upload Image</h2>
          <p className="text-gray-600">Share your creative work with the community</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle>Image Details</CardTitle>
              <CardDescription>Add information about your image</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* URL input (вместо вкладок) */}
                <div className="space-y-2">
                  <Label htmlFor="url">Image URL</Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Paste a direct link to your image</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageTitle">Title *</Label>
                  <Input
                    id="imageTitle"
                    type="text"
                    placeholder="Give your image a catchy title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageDescription">Description</Label>
                  <Textarea
                    id="imageDescription"
                    placeholder="Describe your image, add context or story..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="album">Album (Optional)</Label>
                  <Select value={albumId} onValueChange={setAlbumId}>
                    <SelectTrigger id="album" className="h-11">
                      <SelectValue placeholder="Select an album" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Album</SelectItem>
                      {albums.map((album) => (
                        <SelectItem key={album._id} value={album._id}>
                          {album.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showSuccess && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">Image uploaded successfully!</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section — полный блок */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your image will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-xl overflow-hidden bg-white">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={title || 'Preview'}
                    className="w-full h-64 object-cover"
                    onError={() => setPreviewUrl('')}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    No preview available
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{title || 'Image title'}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {description || 'Image description will appear here.'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {albumId ? 'Assigned to selected album.' : 'No album selected.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

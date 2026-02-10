import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, CheckCircle, Image as ImageIcon, Link, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    if (uploadMethod === 'url' && url) {
      const timer = setTimeout(() => {
        setPreviewUrl(url);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [url, uploadMethod]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (!title) {
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      setTitle(fileName);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

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

  if (!albumId) {
    alert('Please select an album');
    return;
  }

  try {
    await photosAPI.create({
      title,
      description,
      imageUrl: url,      // <‑ только URL, без base64
      albumId,
    });

    setShowSuccess(true);
    setUrl('');
    setTitle('');
    setDescription('');
    setAlbumId('');
    setPreviewUrl('');
    setSelectedFile(null);

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
                {/* Upload Method Tabs */}
                <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'url' | 'file')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file">Upload File</TabsTrigger>
                    <TabsTrigger value="url">From URL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="file" className="space-y-4 mt-4">
                    {!selectedFile ? (
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                          isDragging
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{selectedFile.name}</p>
                              <p className="text-sm text-gray-500">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="w-8 h-8 bg-white hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="url" className="space-y-2 mt-4">
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
                  </TabsContent>
                </Tabs>

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

          {/* Preview Section — твой старый код, без изменений */}
          {/* ... оставь блок Preview таким же, как был ... */}
        </div>
      </div>
    </div>
  );
}

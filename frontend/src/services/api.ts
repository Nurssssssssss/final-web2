const API_BASE = 'https://final-web2-qkl6.onrender.com/api';

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка запроса');
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },
};


export const albumsAPI = {
  getAll: () => apiCall('/albums'),
  
  getById: (id: string) => apiCall(`/albums/${id}`),
  
  create: (albumData: { title: string; description?: string }) =>
    apiCall('/albums', {
      method: 'POST',
      body: JSON.stringify(albumData),
    }),
  
  update: (id: string, albumData: { title?: string; description?: string }) =>
    apiCall(`/albums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(albumData),
    }),
  
  delete: (id: string) =>
    apiCall(`/albums/${id}`, {
      method: 'DELETE',
    }),
};


export const photosAPI = {
  getAll: () => apiCall('/photos'),
  getById: (id: string) => apiCall(`/photos/${id}`),
  create: (photoData: { title: string; description?: string; imageUrl: string; albumId?: string }) =>
    apiCall('/photos', {
      method: 'POST',
      body: JSON.stringify(photoData),
    }),
  update: (id: string, photoData: { title?: string; description?: string; imageUrl?: string; albumId?: string }) =>
    apiCall(`/photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(photoData),
    }),
  delete: (id: string) =>
    apiCall(`/photos/${id}`, {
      method: 'DELETE',
    }),
};



export const userAPI = {
  getProfile: () => apiCall('/users/profile'),
};

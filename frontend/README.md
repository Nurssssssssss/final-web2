  # FrontX – Photo Gallery Platform

FrontX is a web application for storing and viewing images with album support and JWT-based authentication. Users can register, log in, create albums, upload images, filter by albums, and view only their own photos.[web:92][web:95]

---

## Set up instructions

### 1. Prerequisites

- Node.js  
- npm or yarn  
- MongoDB (local instance or MongoDB Atlas)

### 2. Clone the project

```bash
git clone <your-repo-url>
cd <project-folder>



3. Backend setup
Go to the backend folder (for example backend/ or server/ – adjust to your structure):

bash
cd backend
npm install
Create a .env file in the backend folder:

MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
Run the backend:

bash
npm run dev
# or
npm start
The API will be available at http://localhost:5000/api by default.[web:95]

4. Frontend setup
Go to the frontend folder (for example frontend/):

bash
cd ../frontend
npm install
Make sure src/services/api.ts points to your backend:

ts
const API_BASE = 'http://localhost:5000/api';
// or production URL: 'https://final-web2-qkl6.onrender.com/api'
Run the frontend:

bash
npm run dev
Open the URL printed by the dev server (usually http://localhost:5173 or http://localhost:3000).

git status

git add -A

git commit -m "update frontend gallery and backend photo controller"

git push

 Project overview
Features
User registration and login with password hashing and JWT.[cite:2][web:95]

Protected routes via protect middleware that decodes the token and attaches req.user.[cite:16]

Full CRUD for albums (create, read, update, delete).[cite:18]

Full CRUD for photos linked to users and albums.[cite:8][cite:13]

Image filtering:

All Images – all uploaded images.

My Images – only images created by the logged-in user (filtered by userId).

Filter by specific album.

Only the owner (or admin) can delete or update their photos.[cite:8]

Tech stack
Frontend: React, TypeScript, Tailwind CSS, shadcn/ui, lucide-react, react-responsive-masonry.[web:87]

Backend: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens, bcrypt.[web:95]

Deployment: Render for API + any static hosting for the frontend.

 API documentation
Base API URL:

Local: http://localhost:5000/api

Production: https://final-web2-qkl6.onrender.com/api

Auth
router.post('/register', register);
router.post('/login', login);
Register a new user.

router.post('/', protect, createAlbum);
router.get('/', protect, getAlbums);
router.get('/:id', protect, getAlbumById);
router.put('/:id', protect, updateAlbum);
router.delete('/:id', protect, deleteAlbum);

router.post('/', protect, createPhoto);

router.get('/', getPhotos);

router.get('/my', protect, getMyPhotos);

router.get('/:id', getPhotoById);
router.put('/:id', protect, updatePhoto);
router.delete('/:id', protect, deletePhoto);





Body:

json
{
  "username": "nur",
  "email": "user@example.com",
  "password": "secret123"
}
Response:

json
{
  "message": "Регистрация успешна"
}
POST /api/auth/login
Log in a user and get a JWT + user data.[cite:2]

Body:

json
{
  "email": "user@example.com",
  "password": "secret123"
}
Response:

json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "65f...",
    "username": "nur",
    "email": "user@example.com",
    "role": "user"
  }
}
The frontend stores token, currentUser and currentUserId in localStorage.

Users
GET /api/users/profile (protected)
Returns the profile of the currently authenticated user.

Headers:

text
Authorization: Bearer <jwt-token>
Response:

json
{
  "message": "Профиль пользователя",
  "user": {
    "_id": "65f...",
    "username": "nur",
    "email": "user@example.com",
    "role": "user"
  }
}
Photos
Photo model fields:[cite:8]

title: string

description: string

imageUrl: string

albumId: ObjectId or null

userId: ObjectId (ref User, populated with username)

username: string

createdAt, updatedAt: dates

POST /api/photos (protected)
Create a new photo.

Headers:

text
Authorization: Bearer <jwt-token>
Content-Type: application/json
Body:

json
{
  "title": "Turtle",
  "description": "Nice turtle photo",
  "imageUrl": "https://example.com/image.jpg",
  "albumId": "65f... (optional)"
}
Response (example):

json
{
  "_id": "65f...",
  "title": "Turtle",
  "description": "Nice turtle photo",
  "imageUrl": "https://example.com/image.jpg",
  "albumId": "65f...",
  "userId": "65e...",
  "username": "nur",
  "createdAt": "...",
  "updatedAt": "..."
}
GET /api/photos
Public list of all photos, sorted by createdAt (newest first), with userId populated to include the author's username.[cite:13]

Response (single item example):

json
{
  "_id": "65f...",
  "title": "Turtle",
  "description": "NNN",
  "imageUrl": "https://...",
  "albumId": "65f...",
  "userId": {
    "_id": "65e...",
    "username": "nur"
  },
  "createdAt": "...",
  "updatedAt": "..."
}
GET /api/photos/my (protected)
List photos created by the currently logged-in user.

Headers: Authorization: Bearer <jwt-token>

Response: array of photos where userId === req.user._id.[cite:13]

GET /api/photos/:id
Get a single photo by ID (public).

PUT /api/photos/:id (protected)
Update a photo; only the owner or an admin can modify it.

DELETE /api/photos/:id (protected)
Delete a photo; only the owner or an admin can delete it.[cite:8]

Albums
Album model fields:

title: string

description: string

username: string (album creator)

GET /api/albums
Get a list of all albums.

POST /api/albums (protected)
Create a new album.

Body:

json
{
  "title": "My Travel",
  "description": "Photos from trips"
}
GET /api/albums/:id
Get album by ID.

PUT /api/albums/:id (protected)
Update an album.

DELETE /api/albums/:id (protected)
Delete an album.

🖼 Screenshots & features
Replace the image paths with real files in your repository (for example docs/screens/home-gallery.png).[web:96]

1. Home page / Gallery
Home Gallery
![photo_1_2026-02-13_16-48-05](https://github.com/user-attachments/assets/ac7c6fc5-d29d-426f-8dba-5e273084d4f1)


Displays all images in a responsive masonry grid.

Shows total number of images matching the current filter.

Hover effect with title and author.

2. Filter and "My Images"
Filter and My Images

Dropdown to switch between:

All Images

My Images

Specific albums

When My Images is selected, the gallery shows only photos where userId === currentUserId on the frontend.

3. Photo modal
Photo Modal

Large preview of the selected image.

Shows author, description, publish date, and album name.

Delete Image button is visible only to the owner of the photo.

4. Auth: Login / Register
Auth Page

Separate forms for sign up and sign in.

On successful login, the app stores token, currentUser, and currentUserId in localStorage.

After login, the user is redirected to the gallery.

 Possible improvements
Direct file uploads (input type="file" + Cloudinary/S3 backend).[web:92]

Likes, comments, and public/private albums.

User profile page with a dedicated feed and basic statistics.

undefined

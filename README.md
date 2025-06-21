# Brain Inventory Registration API

A user registration API built with Node.js, Express.js, and MongoDB. Supports profile picture upload, email verification, and secure password storage.

## Features
- User registration with name, email, password, and profile picture
- Passwords are securely hashed with bcrypt
- Profile picture upload (JPG/PNG, max 2MB)
- Email verification with tokenized link
- Stores images on server in `uploads/` folder
- Error handling and validation
- Project structure separated into controllers, models, routes, and utils

## Project Structure
```
models/           # Mongoose models
controllers/      # Route controllers
routes/           # Express route definitions
utils/            # Utility functions (email, validation, etc.)
uploads/          # Uploaded profile pictures
server.js         # Main server file
```

## Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or cloud)

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd brain-invertory
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the root directory with the following content:
   ```env
   MONGO_URI=mongodb://localhost:27017/brain_invertory
   PORT=5000
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   JWT_SECRET=your_jwt_secret
   BASE_URL=http://localhost:5000
   ```
   - Replace the email and MongoDB values with your own.

4. **Create the uploads directory** (if not already present):
   ```bash
   mkdir uploads
   ```

5. **Run the server**
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## API Endpoints
### Register User
- **POST** `/api/auth/register`
- Content-Type: `multipart/form-data`
- Fields:
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `profilePicture` (file, optional, JPG/PNG, max 2MB)

### Verify Email
- **GET** `/api/auth/verify-email?token=...&email=...`

## Notes
- After registration, check your email for a verification link.
- Only verified users can log in (login endpoint not included in this starter).

## License
MIT 
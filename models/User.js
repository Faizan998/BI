import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailToken: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema); 
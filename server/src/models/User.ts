import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password_hash: string;
  createdAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password_hash: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


UserSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); 
  this.password_hash = await bcrypt.hash(this.password_hash, salt); 
  next(); 
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password_hash);
  return isMatch;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User; 
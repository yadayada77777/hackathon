import { Schema } from 'mongoose';

export const userSchema: Schema = new Schema({
  email: String,
  name: String,
  user_id: String,
  username: String,
  score: Number
});

userSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

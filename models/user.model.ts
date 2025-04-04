import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  name?: string; // Optional name field
  image?: string; // Optional image field
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Add name field
  image: { type: String }, // Add image field
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
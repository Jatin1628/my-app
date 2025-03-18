import mongoose from 'mongoose';

let isConnected = false; // Track the connection status

export const connectDB = async () => {
  if (isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      
    });

    isConnected = db.connections[0].readyState;
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw new Error('Failed to connect to the database');
  }
};
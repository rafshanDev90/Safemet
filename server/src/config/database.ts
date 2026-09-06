import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/fire-safety-admin';

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log('[DB] MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[DB] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[DB] MongoDB disconnected');
  });

  await mongoose.connect(uri);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

import mongoose from 'mongoose';

const URI = process.env.VITE_MONGODB_URI;

if (!URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

mongoose.set('strictQuery', true);
mongoose.connect(URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'Connected to MongoDB'));

import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to db');
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
    connection.isConnected = db.connections[0].readyState;
    console.log('DB already connected');
  } catch (error) {
    console.log('DB connection failed');
    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;

// config/mongoose.ts
import mongoose, { Mongoose as MongooseInstanceType } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local or Vercel Environment Variables",
  );
}

// Define an interface for the cached mongoose object on the global scope.
interface MongooseCache {
  conn: MongooseInstanceType | null;
  promise: Promise<MongooseInstanceType> | null;
}

// Extend the NodeJS Global type to include mongooseCache.
// This allows us to cache the connection across module reloads in development (HMR).
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<MongooseInstanceType> {
  if (cached!.conn) {
    // console.log('MongoDB: Using cached connection.');
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false, // Important for serverless: fail fast if not connected
      // useNewUrlParser: true, // No longer needed in Mongoose 6+
      // useUnifiedTopology: true, // No longer needed in Mongoose 6+
      // Add any other Mongoose connection options here
      // serverSelectionTimeoutMS: 5000, // Example: Timeout for server selection
    };

    // console.log('MongoDB: Creating new connection.');
    cached!.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB: Connected successfully.");
        // Set up event listeners once connected, if not already attached
        if (mongooseInstance.connection.listeners("error").length === 0) {
          // Simple check
          mongooseInstance.connection.on("error", (err) => {
            console.error("MongoDB: Connection error:", err);
            // You might want to invalidate the cache here or handle retries more explicitly
            cached!.conn = null;
            cached!.promise = null;
          });
          mongooseInstance.connection.on("disconnected", () => {
            console.log("MongoDB: Disconnected.");
            // Invalidate cache on disconnect
            cached!.conn = null;
            cached!.promise = null; // Allow re-connection attempt
          });
          mongooseInstance.connection.on("reconnected", () => {
            console.log("MongoDB: Reconnected.");
          });
        }
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB: Connection promise failed:", error);
        cached!.promise = null; // Clear promise on error to allow retry
        throw error;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    // If the promise awaiting fails, clear it to allow a new attempt next time
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;

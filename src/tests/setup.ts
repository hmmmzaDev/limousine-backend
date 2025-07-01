import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { CustomerService, DriverService, BookingService } from '../services';

// Load environment variables for tests
// This ensures JWT_SECRET and other env vars are available before importing the app
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Set test-specific environment variables if not already set
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'test-jwt-secret-key-limousine-backend-2024';
}

if (!process.env.TEST_MONGODB_URL) {
    process.env.TEST_MONGODB_URL = 'mongodb://localhost:27017/limousine-test-db';
}

// Override MONGODB_URI for tests to use test database
process.env.MONGODB_URI = process.env.TEST_MONGODB_URL;

// Set consistent environment
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Let system choose available port for tests

// Test database connection
export const connectTestDB = async () => {
    const testDBUrl = process.env.TEST_MONGODB_URL || 'mongodb://localhost:27017/limousine-test';

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(testDBUrl);
    }
};

// Clean up test database
export const cleanupTestDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        try {
            // More aggressive cleanup - clear all data
            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();

            for (const collectionInfo of collections) {
                const collection = db.collection(collectionInfo.name);
                await collection.deleteMany({});
            }
        } catch (error) {
            console.log('Collection cleanup error (fallback to service deletion):', error.message);
            // If collection cleanup fails, fall back to service deletion
            try {
                await CustomerService.deleteByQuery({});
                await DriverService.deleteByQuery({});
                await BookingService.deleteByQuery({});
            } catch (serviceError) {
                console.log('Service cleanup also failed:', serviceError.message);
            }
        }
    }
};

// Disconnect from test database
export const disconnectTestDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
};

// Global test setup
export const setupTestDB = () => {
    beforeAll(async () => {
        await connectTestDB();
        // Clean once at the start
        await cleanupTestDB();
    });

    // Removed beforeEach cleanup to prevent race conditions
    // The tests are now responsible for using unique data

    afterAll(async () => {
        // Final cleanup and disconnect
        await cleanupTestDB();
        await disconnectTestDB();
    });
};

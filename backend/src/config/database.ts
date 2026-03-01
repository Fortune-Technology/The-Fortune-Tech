/**
 * Database Configuration
 * MongoDB connection with proper error handling and reconnection logic
 */

import mongoose from 'mongoose';
import { env, isDevelopment } from './env';

export const connectDatabase = async (): Promise<void> => {
    try {
        // Set mongoose options
        mongoose.set('strictQuery', true);

        // Enable debug mode in development
        if (isDevelopment) {
            mongoose.set('debug', false); // Set to true for query logging
        }

        // Connection options
        const options: mongoose.ConnectOptions = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        // Connect to MongoDB
        await mongoose.connect(env.MONGODB_URI, options);

        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
};

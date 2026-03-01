/**
 * Server Entry Point
 * Application startup with database connection
 */

import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

const PORT = env.PORT;

async function startServer(): Promise<void> {
    try {
        // Connect to database
        await connectDatabase();

        // Start server
        const server = app.listen(PORT, () => {
            console.log(`
🚀 The Fortune Tech API Server
   Environment: ${env.NODE_ENV}
   Port: ${String(PORT)}
   URL: http://localhost:${String(PORT)}
   Health: ${`http://localhost:${String(PORT)}/api/health`}
      `);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string): Promise<void> => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                console.log('HTTP server closed');

                try {
                    await disconnectDatabase();
                    console.log('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    console.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('Forced shutdown due to timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            console.error('Uncaught Exception:', error);
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason: unknown) => {
            console.error('Unhandled Rejection:', reason);
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

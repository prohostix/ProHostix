import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../../public');

// Handle 404 for API routes
export const notFound = (req, res, next) => {
    // If it's an API request, send JSON error
    if (req.originalUrl.startsWith('/api')) {
        const error = new Error(`Not Found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    } else {
        // Otherwise send static HTML
        res.status(404).sendFile(path.join(publicPath, '404.html'));
    }
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    console.error(err.stack); // Log error stack for debugging

    // If it's an API request or explicitly JSON expected
    if (req.originalUrl.startsWith('/api') || req.headers['content-type'] === 'application/json') {
        res.status(statusCode).json({
            message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    } else {
        // Otherwise assume a catastrophic server error for a browser request
        res.status(500).sendFile(path.join(publicPath, '500.html'));
    }
};

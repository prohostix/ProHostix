import { NextResponse } from 'next/server';
import connectDB from './db.js';

export async function runMiddleware(req, context, fn) {
    await connectDB();

    let body = {};
    let file = null;

    const method = req.method;
    const contentType = req.headers.get('content-type') || '';

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
            if (contentType.includes('multipart/form-data')) {
                const formData = await req.clone().formData();
                body = Object.fromEntries(formData.entries());

                // Emulate Multer memoryStorage
                // We'll look for common file field names like 'image', 'resume'
                for (const [key, value] of formData.entries()) {
                    if (value && typeof value === 'object' && value.name) {
                        const arrayBuffer = await value.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        // If it's a resume or image, we handle it as Base64 for MongoDB
                        const base64Data = `data:${value.type};base64,${buffer.toString('base64')}`;

                        file = {
                            fieldname: key,
                            originalname: value.name,
                            mimetype: value.type,
                            size: value.size,
                            buffer: buffer,
                            path: base64Data // Return Base64 URI as the path
                        };
                        break; // single file emulation
                    }
                }
            } else {
                body = await req.clone().json();
            }
        } catch (e) {
            // body stays {}
        }
    }

    let query = {};
    const url = new URL(req.url);
    url.searchParams.forEach((val, key) => {
        query[key] = val; // Note: doesn't handle array query params correctly but covers basic usages
    });

    const cookiesObj = {};
    req.cookies.getAll().forEach((c) => {
        cookiesObj[c.name] = c.value;
    });

    const resolvedParams = await (context?.params || {});

    const expressReq = {
        method: req.method,
        url: req.url,
        path: url.pathname,
        query,
        params: resolvedParams,
        body,
        headers: {
            authorization: req.headers.get('authorization'),
            ...Object.fromEntries(req.headers.entries())
        },
        cookies: cookiesObj,
        file: file,
        user: req.user || null
    };

    let status = 200;
    let customHeaders = new Headers();
    let isFinished = false;

    return new Promise((resolve) => {
        const expressRes = {
            status: (code) => {
                status = code;
                return expressRes;
            },
            json: (data) => {
                isFinished = true;
                resolve(NextResponse.json(data, { status, headers: customHeaders }));
            },
            send: (data) => {
                isFinished = true;
                if (typeof data === 'string') {
                    resolve(new NextResponse(data, { status, headers: customHeaders }));
                } else {
                    resolve(NextResponse.json(data, { status, headers: customHeaders }));
                }
            },
            setHeader: (key, value) => {
                customHeaders.set(key, value);
                return expressRes;
            },
            cookie: (name, value, options = {}) => {
                let cookieStr = `${name}=${value}; Path=${options.path || '/'}`;
                if (options.httpOnly) cookieStr += '; HttpOnly';
                if (options.secure) cookieStr += '; Secure';
                if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;
                if (options.expires) cookieStr += `; Expires=${new Date(options.expires).toUTCString()}`;
                if (options.maxAge) cookieStr += `; Max-Age=${options.maxAge / 1000}`;
                customHeaders.append('Set-Cookie', cookieStr);
                return expressRes;
            }
        };

        const next = () => {
            isFinished = true;
            resolve(expressReq); // Indicates middleware passed
        };

        try {
            const result = fn(expressReq, expressRes, next);
            if (result && result.catch) {
                result.catch(err => {
                    resolve(NextResponse.json({ message: err.message }, { status: 500 }));
                });
            }
        } catch (err) {
            resolve(NextResponse.json({ message: err.message }, { status: 500 }));
        }
    });
}

// Wrapper for auth and other middlewares
export async function withMiddleware(req, context, middlewares, controllerFn) {
    if (!Array.isArray(middlewares)) {
        middlewares = [middlewares];
    }

    let currentReq = req;

    for (const middleware of middlewares) {
        if (!middleware) continue;

        const result = await runMiddleware(currentReq, context, middleware);
        if (result instanceof NextResponse) {
            return result; // Middlewared failed / returned response
        }
        // Result is expressReq (passed middleware)
        // Ensure new request has updated state (like req.user)
        currentReq.user = result.user;
        currentReq.file = result.file;
    }

    return runMiddleware(currentReq, context, controllerFn);
}

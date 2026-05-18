/**
 * ============================================
 * PPS Payroll — CORS Configuration
 * ============================================
 */
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        // Allow any localhost port (dev servers: Vite 5173, CRA 3000, live-server 3002, etc.)
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }

        // In production, whitelist specific origins
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // Cache preflight for 24 hours
};

export default corsOptions;

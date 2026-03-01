import rateLimit from "express-rate-limit";

/**
 * Strict limiter for auth endpoints (register & login).
 * 10 attempts per IP per 15 minutes.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
});

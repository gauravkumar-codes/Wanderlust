// A small dependency-free, in-memory rate limiter. It is used on the login and signup routes to slow down
// brute-force and spam attempts. Counters live in memory, so they reset when the server restarts and are
// per-instance; for a multi-instance deployment use a shared store (for example express-rate-limit + Redis).

const ExpressError = require('./ExpressError.js');

module.exports = function rateLimit({ windowMs = 15 * 60 * 1000, max = 10, message = "Too many attempts. Please try again later." } = {}) {
    const hits = new Map();

    // Periodically drop expired entries so the map can't grow forever.
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of hits) {
            if (entry.resetAt <= now) hits.delete(key);
        }
    }, windowMs).unref();

    return (req, res, next) => {
        const now = Date.now();
        const key = req.ip;
        let entry = hits.get(key);

        if (!entry || entry.resetAt <= now) {
            entry = { count: 0, resetAt: now + windowMs };
            hits.set(key, entry);
        }

        entry.count++;
        if (entry.count > max) {
            res.set("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
            return next(new ExpressError(message, 429));
        }
        next();
    };
};

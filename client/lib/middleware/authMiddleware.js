import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect routes – admin must be logged in
 */
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    message: "Not authorized, user not found"
                });
            }

            return next();
        } catch (error) {
            return res.status(401).json({
                message: "Not authorized, token failed"
            });
        }
    }

    return res.status(401).json({
        message: "Not authorized, no token"
    });
};

/**
 * Admin guard (single-admin system)
 */
export const admin = (req, res, next) => {
    // Only admin users exist in the system
    if (!req.user) {
        return res.status(403).json({
            message: "Admin access only"
        });
    }

    next();
};

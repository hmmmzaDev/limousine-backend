import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../helpers/apiError";

// Interface for JWT payload
interface JWTPayload {
    userId: string;
    email: string;
    name: string;
    userType: "customer" | "driver";
    role: "customer" | "driver" | "admin";
    iat?: number;
    exp?: number;
}

// Extend Request type to include user data
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
            validData?: any;
        }
    }
}

/**
 * JWT Authentication Middleware
 * Validates JWT token and attaches user data to request object
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            return next(new UnauthorizedError("Access token is required"));
        }

        if (!process.env.JWT_SECRET) {
            return next(new UnauthorizedError("JWT secret is not configured"));
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

        // Attach user data to request
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError("Token has expired"));
        } else if (error instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedError("Invalid token"));
        } else {
            return next(new UnauthorizedError("Token validation failed"));
        }
    }
}

/**
 * Role-based Authorization Middleware Factory
 * Creates middleware functions for specific role requirements
 */
function createRoleMiddleware(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError("Authentication required"));
        }

        const userRole = req.user.role;
        const userType = req.user.userType;

        // Check if user's role or userType is in allowed roles
        if (!allowedRoles.includes(userRole) && !allowedRoles.includes(userType)) {
            return next(new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(", ")}`));
        }

        next();
    };
}

/**
 * Admin-only access middleware
 * Requires user to have admin role
 */
export const requireAdmin = createRoleMiddleware(["admin"]);

/**
 * Driver-only access middleware
 * Requires user to be a driver
 */
export const requireDriver = createRoleMiddleware(["driver"]);

/**
 * Customer-only access middleware
 * Requires user to be a customer
 */
export const requireCustomer = createRoleMiddleware(["customer"]);

/**
 * Driver or Admin access middleware
 * Allows both drivers and admins
 */
export const requireDriverOrAdmin = createRoleMiddleware(["driver", "admin"]);

/**
 * Customer or Admin access middleware
 * Allows both customers and admins
 */
export const requireCustomerOrAdmin = createRoleMiddleware(["customer", "admin"]);

/**
 * Any authenticated user middleware
 * Requires valid authentication but no specific role
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new UnauthorizedError("Authentication required"));
    }
    next();
};

/**
 * Optional authentication middleware
 * Attaches user data if token is present but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return next(); // Continue without authentication
        }

        if (!process.env.JWT_SECRET) {
            return next(); // Continue without authentication if JWT secret not configured
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
        req.user = decoded;

        next();
    } catch (error) {
        // In optional auth, we ignore token errors and continue
        next();
    }
}

/**
 * Resource ownership middleware
 * Ensures user can only access their own resources
 */
export function requireOwnership(resourceUserIdField: string = "userId") {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError("Authentication required"));
        }

        // Admin can access any resource
        if (req.user.role === "admin") {
            return next();
        }

        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField] || req.query[resourceUserIdField];

        if (!resourceUserId) {
            return next(new ForbiddenError("Resource user ID is required"));
        }

        if (req.user.userId !== resourceUserId) {
            return next(new ForbiddenError("Access denied. You can only access your own resources"));
        }

        next();
    };
}

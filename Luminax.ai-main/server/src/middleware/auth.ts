import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { supabaseAdmin } from "../lib/supabase";

export interface AuthedRequest extends Request {
	userId?: string;
	user?: any;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Missing Authorization header" });
    const token = header.replace("Bearer ", "");

    // Try Supabase session first if configured
    if (supabaseAdmin) {
        try {
            const { data, error } = await supabaseAdmin.auth.getUser(token);
            if (!error && data?.user?.id) {
                req.userId = data.user.id;
                req.user = data.user;
                return next();
            }
        } catch (error) {
            console.error('Supabase auth error:', error);
        }
    }

    // Fallback to local JWT
    try {
        const payload = jwt.verify(token, env.jwTSecret) as any;
        req.userId = payload.sub;
        return next();
    } catch (error) {
        console.error('JWT auth error:', error);
        return res.status(401).json({ error: "Invalid token" });
    }
}

export async function optionalAuth(req: AuthedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    
    if (!header) {
        req.userId = undefined;
        req.user = undefined;
        return next();
    }
    
    const token = header.replace("Bearer ", "");

    // Try Supabase session first if configured
    if (supabaseAdmin) {
        try {
            const { data, error } = await supabaseAdmin.auth.getUser(token);
            if (!error && data?.user?.id) {
                req.userId = data.user.id;
                req.user = data.user;
                return next();
            }
        } catch (error) {
            console.error('Supabase optional auth error:', error);
        }
    }

    // Fallback to local JWT
    try {
        const payload = jwt.verify(token, env.jwTSecret) as any;
        req.userId = payload.sub;
        return next();
    } catch (error) {
        console.error('JWT optional auth error:', error);
        req.userId = undefined;
        req.user = undefined;
        return next();
    }
}



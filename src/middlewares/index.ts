import express from "express";
import { merge } from "lodash";

import { verifyToken } from "../helpers";

export const isAuthenticated = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(403).json({ message: "Access Denied." });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimStart();
        }

        const verified = verifyToken(token);
        merge(req, { user: verified });
        return next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

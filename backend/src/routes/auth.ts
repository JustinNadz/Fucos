import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            res.status(400).json({ error: "Email, name, and password are required" });
            return;
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "Email already in use" });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: { email, name, passwordHash },
            select: { id: true, email: true, name: true, createdAt: true },
        });

        // Create default settings
        await prisma.userSettings.create({
            data: { userId: user.id },
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "fallback-secret",
            { expiresIn: "7d" }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "fallback-secret",
            { expiresIn: "7d" }
        );

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/auth/me - Get current user
router.get(
    "/me",
    authMiddleware,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.userId },
                select: { id: true, email: true, name: true, createdAt: true },
            });

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            res.json(user);
        } catch (error) {
            console.error("Get user error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

export default router;

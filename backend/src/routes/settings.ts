import { Router, Response } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/settings - Get user settings
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let settings = await prisma.userSettings.findUnique({
            where: { userId: req.userId },
        });

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.userSettings.create({
                data: { userId: req.userId! },
            });
        }

        res.json(settings);
    } catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT /api/settings - Update user settings
router.put("/", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { defaultPomodoro, shortBreak, longBreak, soundEnabled, notifyEnabled } =
            req.body;

        const settings = await prisma.userSettings.upsert({
            where: { userId: req.userId },
            update: {
                ...(defaultPomodoro !== undefined && { defaultPomodoro }),
                ...(shortBreak !== undefined && { shortBreak }),
                ...(longBreak !== undefined && { longBreak }),
                ...(soundEnabled !== undefined && { soundEnabled }),
                ...(notifyEnabled !== undefined && { notifyEnabled }),
            },
            create: {
                userId: req.userId!,
                defaultPomodoro: defaultPomodoro ?? 25,
                shortBreak: shortBreak ?? 5,
                longBreak: longBreak ?? 15,
                soundEnabled: soundEnabled ?? true,
                notifyEnabled: notifyEnabled ?? true,
            },
        });

        res.json(settings);
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

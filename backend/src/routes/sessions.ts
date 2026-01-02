import { Router, Response } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/sessions - List all focus sessions
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const sessions = await prisma.focusSession.findMany({
            where: { userId: req.userId },
            orderBy: { completedAt: "desc" },
            take: 100, // Limit to last 100 sessions
        });
        res.json(sessions);
    } catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/sessions - Create a session
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { task, minutes } = req.body;

        if (!minutes || typeof minutes !== "number" || minutes <= 0) {
            res.status(400).json({ error: "Valid minutes is required" });
            return;
        }

        const session = await prisma.focusSession.create({
            data: {
                task: task || null,
                minutes,
                userId: req.userId!,
            },
        });

        // Emit real-time event
        const io = req.app.get("io");
        io.to(`user:${req.userId}`).emit("session:created", session);

        res.status(201).json(session);
    } catch (error) {
        console.error("Create session error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/sessions/stats - Get statistics
router.get("/stats", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        // Get all sessions for this user
        const sessions = await prisma.focusSession.findMany({
            where: { userId },
            orderBy: { completedAt: "desc" },
        });

        // Calculate stats
        const totalSessions = sessions.length;
        const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySessions = sessions.filter(
            (s) => new Date(s.completedAt) >= today
        );
        const todayMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0);

        // Get this week's stats
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekSessions = sessions.filter(
            (s) => new Date(s.completedAt) >= weekStart
        );
        const weekMinutes = weekSessions.reduce((sum, s) => sum + s.minutes, 0);

        // Calculate streak (consecutive days with at least one session)
        let streak = 0;
        const dayMs = 24 * 60 * 60 * 1000;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        while (true) {
            const dayStart = new Date(currentDate);
            const dayEnd = new Date(currentDate.getTime() + dayMs);

            const hasSession = sessions.some((s) => {
                const completed = new Date(s.completedAt);
                return completed >= dayStart && completed < dayEnd;
            });

            if (hasSession) {
                streak++;
                currentDate = new Date(currentDate.getTime() - dayMs);
            } else {
                break;
            }
        }

        res.json({
            totalSessions,
            totalMinutes,
            totalHours,
            todaySessions: todaySessions.length,
            todayMinutes,
            weekSessions: weekSessions.length,
            weekMinutes,
            streak,
        });
    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

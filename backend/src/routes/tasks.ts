import { Router, Response } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/tasks - List all tasks
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(tasks);
    } catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/tasks - Create a task
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            res.status(400).json({ error: "Task text is required" });
            return;
        }

        const task = await prisma.task.create({
            data: {
                text: text.trim(),
                userId: req.userId!,
            },
        });

        // Emit real-time event
        const io = req.app.get("io");
        io.to(`user:${req.userId}`).emit("task:created", task);

        res.status(201).json(task);
    } catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PATCH /api/tasks/:id - Update a task
router.patch("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { text, done } = req.body;

        // Verify ownership
        const existing = await prisma.task.findFirst({
            where: { id, userId: req.userId },
        });

        if (!existing) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                ...(text !== undefined && { text: text.trim() }),
                ...(done !== undefined && { done }),
            },
        });

        // Emit real-time event
        const io = req.app.get("io");
        io.to(`user:${req.userId}`).emit("task:updated", task);

        res.json(task);
    } catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /api/tasks/:id - Delete a task
router.delete(
    "/:id",
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            // Verify ownership
            const existing = await prisma.task.findFirst({
                where: { id, userId: req.userId },
            });

            if (!existing) {
                res.status(404).json({ error: "Task not found" });
                return;
            }

            await prisma.task.delete({ where: { id } });

            // Emit real-time event
            const io = req.app.get("io");
            io.to(`user:${req.userId}`).emit("task:deleted", { id });

            res.status(204).send();
        } catch (error) {
            console.error("Delete task error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

export default router;

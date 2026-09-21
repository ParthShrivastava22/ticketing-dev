import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

router.get("/api/assets", async (req: Request, res: Response) => {
  res.send({});
});

export { router as indexRouter };

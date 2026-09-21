import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

router.delete(`/api/assets/:orderId`, async (req: Request, res: Response) => {
  res.send({});
});

export { router as deleteOrderRouter };

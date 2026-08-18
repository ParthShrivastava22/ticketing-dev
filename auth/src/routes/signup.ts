import express from "express";
import type { Request, Response } from "express";
import { validateRequest, BadRequestError } from "@digitalassetps/common";
import { z } from "zod";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

// 1. Define the schema structure out of the way
const signupSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .trim() // Sanitization: automatically strips leading/trailing spaces
    .min(4, { message: "Password must be at least 4 characters" }),
});

const router = express.Router();

router.post(
  "/api/users/signup",
  validateRequest(signupSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email is already in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    // Store JWT on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  },
);

export { router as signupRouter };

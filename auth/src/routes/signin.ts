import express from "express";
import type { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error.js";
import { User } from "../models/user.js";
import { Password } from "../services/password.js";
import { z } from "zod";
import { validateRequest } from "../middleware/validate-request.js";
import jwt from "jsonwebtoken";

const signInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().trim().nonempty("You must give a password"),
});

const router = express.Router();

router.post(
  "/api/users/signin",
  validateRequest(signInSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new BadRequestError("Invalid credentials");

    const passwordsMatch = await Password.compare(user.password, password);

    if (!passwordsMatch) throw new BadRequestError("Invalid credentials");

    const userJwt = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  },
);

export { router as signinRouter };

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/User";
import generateToken from "../utils/generateToken";
import { AuthRequest, AuthResponse, ErrorResponse } from "../types/authTypes";
import jwt from 'jsonwebtoken'
export const register = async (
  req: Request<
    Record<string, never>,
    AuthResponse | ErrorResponse,
    AuthRequest & { username: string }
  >,
  res: Response<AuthResponse | ErrorResponse>
): Promise<void> => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new UserModel({ 
      email,
      password: hashedPassword,
      username,
    });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({
      token,
      userId: user._id.toString(),
      user: {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const login = async (
  req: Request<
    Record<string, never>,
    AuthResponse | ErrorResponse,
    AuthRequest
  >,
  res: Response<AuthResponse | ErrorResponse>
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User was not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Wrong Password" });
      return;
    }

    const token = generateToken(user);

    res.json({
      token,
      userId: user._id.toString(),
      user: {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
export const verifyToken = async (
  req: Request<Record<string, never>, AuthResponse | ErrorResponse>,
  res: Response<AuthResponse | ErrorResponse>
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      token,
      userId: user._id.toString(),
      user: {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" + err.message });
  }
};

export const logout = async (
  req: Request<Record<string, never>, { message: string }>,
  res: Response<{ message: string }>
): Promise<void> => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" + err.message });
  }
};
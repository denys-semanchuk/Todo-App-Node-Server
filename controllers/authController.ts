import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import generateToken from '../utils/generateToken';

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  userId: string;
}

interface ErrorResponse {
  message: string;
}

export const register = async (
  req: Request<Record<string, never>, AuthResponse | ErrorResponse, AuthRequest>,
  res: Response<AuthResponse | ErrorResponse>
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Пользователь уже существует' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id.toString());

    res.status(201).json({ token, userId: user._id.toString() });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const login = async (
  req: Request<Record<string, never>, AuthResponse | ErrorResponse, AuthRequest>,
  res: Response<AuthResponse | ErrorResponse>
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Пользователь не найден' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Неверный пароль' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({ token, userId: user._id.toString() });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
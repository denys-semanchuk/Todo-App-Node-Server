import jwt from 'jsonwebtoken';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

export default generateToken;
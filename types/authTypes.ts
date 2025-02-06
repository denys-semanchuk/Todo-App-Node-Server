export interface IUser {
  _id: string;
  email: string;
  username: string;
  password?: string;
  __v?: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  user: IUser;
}

export interface ErrorResponse {
  message: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
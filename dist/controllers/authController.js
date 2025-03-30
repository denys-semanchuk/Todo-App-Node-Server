var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
import UserModel from "../models/User";
import generateToken from "../utils/generateToken";
import jwt from 'jsonwebtoken';
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    try {
        const existingUser = yield UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcrypt.hash(password, 12);
        const user = new UserModel({
            email,
            password: hashedPassword,
            username,
        });
        yield user.save();
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
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User was not found" });
            return;
        }
        const isMatch = yield bcrypt.compare(password, user.password);
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
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
export const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = yield UserModel.findById(decoded.id);
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
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" + err.message });
    }
});
export const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Logout failed" + err.message });
    }
});
//# sourceMappingURL=authController.js.map
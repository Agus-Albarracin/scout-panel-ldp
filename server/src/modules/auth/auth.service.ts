import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";
import { authRepository } from "./auth.repository";

type AuthInput = {
  email: string;
  password: string;
};

type RegisterInput = AuthInput & {
  name: string;
};

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await authRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash
    });

    return buildAuthResponse(user);
  },

  async login(input: AuthInput) {
    const user = await authRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    return buildAuthResponse(user);
  },

  async me(userId: string) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return mapUser(user);
  }
};

function buildAuthResponse(user: { id: string; name: string; email: string }) {
  return {
    token: signToken(user.id),
    user: mapUser(user)
  };
}

function signToken(userId: string) {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign({ sub: userId }, env.JWT_SECRET, options);
}

function mapUser(user: { id: string; name: string; email: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

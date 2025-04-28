import { UserRepository } from "../../../domain/repository/user/user.repository";
import { generateAccessToken, generateRefreshToken } from "../../../shared/jwt";
import { AuthResponse } from "../../../domain/dtos/auth/auth-response.dto";
import { User } from "../../../domain/entities/user/user.entity";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async checkUser(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async login(email: string): Promise<AuthResponse | null> {
    const user = await this.checkUser(email);
    if (!user) {
      return null;
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return {
      credentials: true,
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }

  async register(email: string): Promise<AuthResponse | null> {
    const isExistingUser = await this.checkUser(email);
    if (isExistingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }
    const newUser = await this.userRepository.create(email);
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    return {
      credentials: true,
      accessToken,
      refreshToken,
      userId: newUser.id,
    };
  }
}

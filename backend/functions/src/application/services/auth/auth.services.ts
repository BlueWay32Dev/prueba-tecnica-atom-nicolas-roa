import {UserRepository} from "../../../domain/repository/user/user.repository";
import {generateAccessToken, generateRefreshToken} from "../../../shared/jwt";
import {AuthResponse} from "../../../domain/dtos/auth/auth-response.dto";
import {User} from "../../../domain/entities/user/user.entity";

/** Service for authentication */
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param {UserRepository} userRepository User repository
   */
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Checks if a user exists by email.
   * @param {string} email User email
   * @return {Promise<User | null>}
   */
  async checkUser(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  /**
   * Logs in a user by email.
   * @param {string} email User email
   * @return {Promise<AuthResponse | null>}
   */
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

  /**
   * Registers a new user by email.
   * @param {string} email User email
   * @return {Promise<AuthResponse | null>}
   */
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

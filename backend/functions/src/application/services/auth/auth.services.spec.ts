import { AuthService } from "./auth.services";
import { UserRepository } from "../../../domain/repository/user/user.repository";
import { User } from "../../../domain/entities/user/user.entity";

jest.mock("../../../shared/jwt", () => ({
  generateAccessToken: jest.fn(() => "mocked-access-token"),
  generateRefreshToken: jest.fn(() => "mocked-refresh-token"),
}));

describe("AuthServices", () => {
  const mockUserRepository: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  } as any;

  let authService: AuthService;
  const testUser = new User("test-id", "test@example.com", new Date());

  beforeEach(() => {
    authService = new AuthService(mockUserRepository);
    jest.clearAllMocks();
  });

  describe("checkUser", () => {
    it("debería llamar a findByEmail del repositorio y devolver el resultado", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(testUser);

      const result = await authService.checkUser("test@example.com");

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(result).toEqual(testUser);
    });

    it("debería devolver null cuando el usuario no existe", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await authService.checkUser("nonexistent@example.com");

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com"
      );
      expect(result).toBeNull();
    });
  });

  describe("login", () => {
    it("debería devolver credenciales y tokens cuando el usuario existe", async () => {
      jest.spyOn(authService, "checkUser").mockResolvedValue(testUser);

      const result = await authService.login("test@example.com");

      expect(authService.checkUser).toHaveBeenCalledWith("test@example.com");
      expect(result).toEqual({
        credentials: true,
        accessToken: "mocked-access-token",
        refreshToken: "mocked-refresh-token",
        userId: "test-id",
      });
    });

    it("debería devolver null cuando el usuario no existe", async () => {
      jest.spyOn(authService, "checkUser").mockResolvedValue(null);

      const result = await authService.login("nonexistent@example.com");

      expect(authService.checkUser).toHaveBeenCalledWith(
        "nonexistent@example.com"
      );
      expect(result).toBeNull();
    });
  });

  describe("register", () => {
    it("debería registrar un nuevo usuario y devolver credenciales y tokens", async () => {
      jest.spyOn(authService, "checkUser").mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(testUser);

      const result = await authService.register("new@example.com");

      expect(authService.checkUser).toHaveBeenCalledWith("new@example.com");
      expect(mockUserRepository.create).toHaveBeenCalledWith("new@example.com");
      expect(result).toEqual({
        credentials: true,
        accessToken: "mocked-access-token",
        refreshToken: "mocked-refresh-token",
        userId: "test-id",
      });
    });

    it("debería lanzar un error cuando el usuario ya existe", async () => {
      jest.spyOn(authService, "checkUser").mockResolvedValue(testUser);

      await expect(
        authService.register("existing@example.com")
      ).rejects.toThrow("USER_ALREADY_EXISTS");
      expect(authService.checkUser).toHaveBeenCalledWith(
        "existing@example.com"
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});

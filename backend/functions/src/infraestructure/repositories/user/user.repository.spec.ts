import { FirestoreUserRepository } from "../../../infraestructure/repositories/user/user.repository";
import { User } from "../../../domain/entities/user/user.entity";
import { db } from "../../firebase/firestore.config";
import { v4 as uuid } from "uuid";

jest.mock("../../firebase/firestore.config", () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("FirestoreUserRepository", () => {
  let repository: FirestoreUserRepository;
  const mockCollection = {
    doc: jest.fn(),
    where: jest.fn(),
  };
  const mockDocRef = {
    set: jest.fn(),
  };
  const mockWhereRef = {
    limit: jest.fn(),
  };
  const mockLimitRef = {
    get: jest.fn(),
  };
  const testEmail = "test@example.com";
  const testId = "user-123";
  const testCreatedAt = new Date();

  beforeEach(() => {
    jest.clearAllMocks();
    (db.collection as jest.Mock).mockReturnValue(mockCollection);
    mockCollection.doc.mockReturnValue(mockDocRef);
    mockCollection.where.mockReturnValue(mockWhereRef);
    mockWhereRef.limit.mockReturnValue(mockLimitRef);
    (uuid as jest.Mock).mockReturnValue(testId);
    repository = new FirestoreUserRepository();
  });

  describe("findByEmail", () => {
    it("should return user when user exists", async () => {
      const mockDocs = [
        {
          id: testId,
          data: () => ({
            email: testEmail,
            createdAt: { toDate: () => testCreatedAt },
          }),
        },
      ];

      mockLimitRef.get.mockResolvedValueOnce({
        empty: false,
        docs: mockDocs,
      });

      const result = await repository.findByEmail(testEmail);

      expect(db.collection).toHaveBeenCalledWith("users");
      expect(mockCollection.where).toHaveBeenCalledWith(
        "email",
        "==",
        testEmail
      );
      expect(mockWhereRef.limit).toHaveBeenCalledWith(1);
      expect(mockLimitRef.get).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(testId);
      expect(result?.email).toBe(testEmail);
      expect(result?.createdAt).toBe(testCreatedAt);
    });

    it("should return null when user does not exist", async () => {
      mockLimitRef.get.mockResolvedValueOnce({
        empty: true,
        docs: [],
      });

      const result = await repository.findByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new user in Firestore", async () => {
      mockDocRef.set.mockResolvedValueOnce(undefined);

      const result = await repository.create(testEmail);

      expect(uuid).toHaveBeenCalled();
      expect(db.collection).toHaveBeenCalledWith("users");
      expect(mockCollection.doc).toHaveBeenCalledWith(testId);
      expect(mockDocRef.set).toHaveBeenCalledWith({
        email: testEmail,
        createdAt: expect.any(Date),
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(testId);
      expect(result.email).toBe(testEmail);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });
});

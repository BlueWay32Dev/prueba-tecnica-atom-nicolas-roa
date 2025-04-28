import { User } from "../../../domain/entities/user/user.entity";

describe("User Entity", () => {
  it("Debe crear un usuario instanciado con todas sus propiedades", () => {
    const id = "user-123";
    const email = "nroa@atom.com";
    const createdAt = new Date();

    const user = new User(id, email, createdAt);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(id);
    expect(user.email).toBe(email);
    expect(user.createdAt).toBe(createdAt);
  });

  it("Debe convertir un JSON correcto", () => {
    const id = "user-123";
    const email = "nroa@atom.com";
    const createdAt = new Date("2025-04-28T12:00:00.000Z");

    const user = new User(id, email, createdAt);
    const userJson = user.toJSON();

    expect(userJson).toEqual({
      id: "user-123",
      email: "nroa@atom.com",
      createdAt: "2025-04-28T12:00:00.000Z",
    });
  });

  it("Debe manejar un email con distintos dominios", () => {
    const id = "user-456";
    const email = "nroa2024@gmail.com";
    const createdAt = new Date();

    const user = new User(id, email, createdAt);

    expect(user.email).toBe("nroa2024@gmail.com");
  });
});

import {Request, Response} from "express";
import {FirestoreUserRepository} from "../../repositories/user/user.repository";
import {AuthService} from "../../../application/services/auth/auth.services";
import {generateAccessToken, verifyRefreshToken} from "../../../shared/jwt";
import {User} from "../../../domain/entities/user/user.entity";

const userRepo = new FirestoreUserRepository();
const authService = new AuthService(userRepo);

const hasEmailEmpty = (request: Request): string => {
  const {email} = request.body;
  if (!email) throw new Error("EMPTY_EMAIL");
  return email;
};

export const loginHandler = async (request: Request, response: Response) => {
  try {
    const email = hasEmailEmpty(request);
    const token = await authService.login(email);

    if (!token) {
      return response
        .status(200)
        .json({message: "El usuario no existe!", credentials: false});
    }

    return response.status(200).json(token);
  } catch (e) {
    const error = e as Error;
    if (error.message === "EMPTY_EMAIL") {
      return response.status(400).json({message: "Correo es requerido"});
    }
    return response.status(500).json({message: "Error interno del servidor"});
  }
};

export const registerHandler = async (request: Request, response: Response) => {
  try {
    const {email} = request.body;
    const token = await authService.register(email);
    return response.status(200).json(token);
  } catch (e) {
    const error = e as Error;
    if (error.message === "USER_ALREADY_EXISTS") {
      return response.status(400).json({message: "El usuario ya existe"});
    }
    return response.status(500).json({message: "Error interno del servidor"});
  }
};

export const refreshHandler = async (request: Request, response: Response) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response
        .status(400)
        .json({message: "Refrescar el token es requerido"});
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return response
        .status(400)
        .json({message: "Refrescar el token es requerido"});
    }

    const payload = verifyRefreshToken(token);

    if (!payload) {
      return response
        .status(401)
        .json({message: "Token inválido o expirado"});
    }

    const {sub, email} = payload;

    const accessToken = generateAccessToken(new User(sub, email, new Date()));

    return response.status(200).json({accessToken});
  } catch (e) {
    console.error(e);
    return response.status(401).json({message: "Token inválido o expirado"});
  }
};

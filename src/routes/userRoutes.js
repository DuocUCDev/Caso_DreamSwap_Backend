
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { registerSchema, loginSchema, updateUserSchema } from "../schemas/userSchemas.js";
import { register, login, me, updateMe, listUsers } from "../controllers/userController.js";

const router = Router();

// Públicos 
router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);

// Autenticación
router.get("/users/me", auth, me);
router.patch("/users/me", auth, validate(updateUserSchema), updateMe);

// (Opcional) Admin
router.get("/admin/users", auth, listUsers);

export default router;
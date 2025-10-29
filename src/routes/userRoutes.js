
import { Route } from "express";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { registerSchema, loginSchema, updateUserSchema } from "../schemas/userSchemas.js";
import { register, login, me, updateMe, listUsers } from "../controllers/userController.js";

const router = Route();

// Públicos 
router.post("auth/register", validate(registerSchema), register);
router.post("auth/login", validate(loginSchema), login);

// Autenticación
router.get("users/me", auth, me);
router.path("users/me", auth, validate(updateUserSchema), updateMe);

// (Opcional) Admin
router.get("admin/users", auth, listUsers);

export default router;
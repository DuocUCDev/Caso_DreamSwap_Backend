import { de } from "zod/locales";

export const validate = 
    (schema) =>
    (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: "Validation fallida",
                details: parsed.error.flatten(),
            });
        }
        req.validated = parsed.data;
        next();
    };
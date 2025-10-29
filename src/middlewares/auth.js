import jwt from 'jsonwebtoken';

export function signToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
}

export function auth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ error: "Token requerido." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido." });
    }
}
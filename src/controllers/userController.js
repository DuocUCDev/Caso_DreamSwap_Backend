import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../middlewares/auth.js";

const PUBLIC_FIELDS = "firstName lastName email phone isActive profileImage createdAt updatedAt";

export async function register(req, res) {
  const { firstName, lastName, email, phone, password, profileImage } = req.validated;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email ya registrado" });

  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
  const passwordHash = await bcrypt.hash(password, rounds);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone: phone || undefined,
    passwordHash,
    profileImage: profileImage || undefined,
  });

  const token = signToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRES || "7d");
  const safe = await User.findById(user._id).select(PUBLIC_FIELDS);

  return res.status(201).json({ user: safe, token });
}

export async function login(req, res) {
  const { email, password } = req.validated;

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = signToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRES || "7d");
  const safe = await User.findById(user._id).select(PUBLIC_FIELDS);

  return res.json({ user: safe, token });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select(PUBLIC_FIELDS);
  return res.json({ user });
}

export async function updateMe(req, res) {
  const updates = req.validated;

  // Seguridad: no permitir cambiar email a uno ya usado
  if (updates.email) {
    const exists = await User.findOne({ email: updates.email, _id: { $ne: req.user.id } });
    if (exists) return res.status(409).json({ error: "Email ya en uso" });
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  }).select(PUBLIC_FIELDS);

  return res.json({ user });
}

export async function listUsers(req, res) {
  // Pensado para admin: pagina simple
  const { page = 1, limit = 20, q } = req.query;
  const filter = q
    ? {
        $or: [
          { firstName: new RegExp(q, "i") },
          { lastName: new RegExp(q, "i") },
          { email: new RegExp(q, "i") },
          { phone: new RegExp(q, "i") }
        ]
      }
    : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    User.find(filter).select(PUBLIC_FIELDS).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter)
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

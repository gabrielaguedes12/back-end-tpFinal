import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ mensagem: "Não autorizado" });

  if (!authHeader.startsWith("Bearer "))
    return res.status(401).json({ mensagem: "Token mal formatado" });

  const token = authHeader.split(" ")[1];

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ mensagem: "Token inválido" });
  }
}

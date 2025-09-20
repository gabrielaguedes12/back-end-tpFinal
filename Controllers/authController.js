import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ nome, email, senha: hash, tipo });
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    });
  } catch (err) {
    res.status(400).json({ mensagem: err.message });
  }
};

export const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario)
      return res.status(400).json({ mensagem: "Usuário não encontrado" });

    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.status(400).json({ mensagem: "Senha incorreta" });

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, id: usuario.id, nome: usuario.nome, tipo: usuario.tipo });
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

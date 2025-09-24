import Usuario from "../models/Usuario.js";

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'tipo', 'nome'],
    });

    res.status(200).json(usuarios);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ mensagem: err.message });
  }
};
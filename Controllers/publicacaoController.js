import Publicacao from "../models/Publicacao.js";
import { Op } from "sequelize";
import cloudinary from "../utils/cloudnary.js";

export const criarPublicacao = async (req, res) => {
  try {
    let urlImagem = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      urlImagem = result.secure_url;
    }

    const publicacao = await Publicacao.create({
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      imagem: urlImagem,
      usuarioId: req.usuario.id,
    });

    res.json(publicacao);
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

export const listarPublicacoes = async (req, res) => {
  const busca = req.query.busca || "";
  try {
    const publicacoes = await Publicacao.findAll({
      where: { titulo: { [Op.like]: `%${busca}%` } },
      order: [["createdAt", "DESC"]],
    });
    res.json(publicacoes);
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

export const curtirPublicacao = async (req, res) => {
  const { id } = req.params;
  try {
    const pub = await Publicacao.findByPk(id);
    if (!pub)
      return res.status(404).json({ mensagem: "Publicação não encontrada" });

    pub.curtidas += 1;
    await pub.save();
    res.json(pub);
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

export const deletarPublicacao = async (req, res) => {
  const { id } = req.params;
  try {
    const publicacao = await Publicacao.findByPk(id);

    if (!publicacao) {
      return res.status(404).json({ mensagem: "Publicação não encontrada." });
    }

    if (publicacao.usuarioId !== req.usuario.id) {
      return res.status(403).json({ mensagem: "Você não tem permissão para excluir esta publicação." });
    }

    await publicacao.destroy();
    res.status(200).json({ mensagem: "Publicação excluída com sucesso." });

  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

export const editarPublicacao = async (req, res) => {
  const { id } = req.params;
  try {
    const publicacao = await Publicacao.findByPk(id);

    if (!publicacao) {
      return res.status(404).json({ mensagem: "Publicação não encontrada." });
    }

    if (publicacao.usuarioId !== req.usuario.id) {
      return res.status(403).json({ mensagem: "Você não tem permissão para editar esta publicação." });
    }

    await publicacao.update(req.body);

    res.status(200).json({ mensagem: "Publicação editada com sucesso.", publicacao });

  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

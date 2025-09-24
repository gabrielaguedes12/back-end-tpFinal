import Publicacao from "../models/Publicacao.js";
import { Op } from "sequelize";
import cloudinary from "../utils/cloudnary.js";
import { URL } from 'url';

const extractPublicId = (url) => {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/');
    const publicIdWithExtension = pathSegments[pathSegments.length - 1];
    return publicIdWithExtension.split('.')[0];
  } catch (error) {
    console.error("Erro ao extrair public_id da URL:", error);
    return null;
  }
};

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
      // ✅ Inclua o 'usuarioId' para que o front-end possa usá-lo na comparação
      attributes: ['id', 'titulo', 'descricao', 'imagem', 'curtidas', 'usuarioId'],
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
    
    if (publicacao.imagem) {
      const publicId = extractPublicId(publicacao.imagem);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
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

    let urlImagem = publicacao.imagem;
    if (req.file) {
      if (publicacao.imagem) {
        const publicId = extractPublicId(publicacao.imagem);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      urlImagem = result.secure_url;
    }

    await publicacao.update({
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      imagem: urlImagem,
    });

    res.status(200).json({ mensagem: "Publicação editada com sucesso.", publicacao });

  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};
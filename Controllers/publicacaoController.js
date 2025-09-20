import Publicacao from "../models/Publicacao.js";
import cloudinary from "../utils/cloudinary.js";

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
  const publicacoes = await Publicacao.findAll({
    where: { titulo: { [Op.like]: `%${busca}%` } },
    order: [["createdAt", "DESC"]],
  });
  res.json(publicacoes);
};

export const curtirPublicacao = async (req, res) => {
  const { id } = req.params;
  const pub = await Publicacao.findByPk(id);
  if (!pub)
    return res.status(404).json({ mensagem: "Publicação não encontrada" });
  pub.curtidas += 1;
  await pub.save();
  res.json(pub);
};

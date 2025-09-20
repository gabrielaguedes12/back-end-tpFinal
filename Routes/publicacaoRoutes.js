import express from "express";
import {
  criarPublicacao,
  listarPublicacoes,
  curtirPublicacao,
} from "../Controllers/publicacaoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", listarPublicacoes);
router.post("/", authMiddleware, upload.single("imagem"), criarPublicacao);
router.patch("/:id/curtir", authMiddleware, curtirPublicacao);

export default router;

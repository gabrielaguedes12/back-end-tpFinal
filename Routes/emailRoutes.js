import express from "express";
import multer from "multer";
import { enviarPdf } from "../Controllers/emailController.js";

const router = express.Router();
const upload = multer(); // guarda em memória

router.post("/enviar-pdf", upload.single("file"), enviarPdf);

export default router;

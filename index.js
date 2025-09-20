import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./database/db.js";
import authRoutes from "./Routes/authRoutes.js";
import publicacaoRoutes from "./Routes/publicacaoRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/publicacoes", publicacaoRoutes);

app.get("/", (req, res) => res.send("API rodando!"));

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Apenas autentica a conexão, não tenta alterar colunas
    await sequelize.authenticate();
    console.log("Conexão com o banco OK!");

    // Opcional: sincroniza sem alterar colunas existentes
    // await sequelize.sync(); // só cria tabelas que não existem

    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
  }
})();

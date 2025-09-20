import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import publicacaoRoutes from "./routes/publicacaoRoutes.js";

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/auth", authRoutes);
app.use("/publicacoes", publicacaoRoutes);

// Teste de rota inicial
app.get("/", (req, res) => {
  res.send("API rodando!");
});

// Sincroniza com o banco e inicia o servidor
const PORT = process.env.PORT || 3000;
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco estabelecida!");
    return sequelize.sync(); // Sincroniza modelos
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar com o banco:", err);
  });

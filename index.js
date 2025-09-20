import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./database/db.js";
import authRoutes from "./Routes/authRoutes.js";
import publicacaoRoutes from "./Routes/publiRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/publicacoes", publicacaoRoutes);

app.get("/", (req, res) => {
  res.send("API rodando!");
});

const PORT = process.env.PORT || 3000;
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco estabelecida!");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar com o banco:", err);
  });

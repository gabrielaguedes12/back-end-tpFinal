import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
import Usuario from "./Usuario.js";

const Publicacao = sequelize.define("Publicacao", {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  imagem: { type: DataTypes.STRING },
  curtidas: { type: DataTypes.INTEGER, defaultValue: 0 },
  comentarios: { type: DataTypes.INTEGER, defaultValue: 0 },
});

// Associações
Publicacao.belongsTo(Usuario, { foreignKey: "usuarioId" });
Usuario.hasMany(Publicacao, { foreignKey: "usuarioId" });

export default Publicacao;

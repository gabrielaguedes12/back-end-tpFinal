import { DataTypes } from "sequelize";
import sequelize from "../database/db";

const Usuario = sequelize.define("Usuario", {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.ENUM("usuario", "anunciante"), allowNull: false },
});

export default Usuario;

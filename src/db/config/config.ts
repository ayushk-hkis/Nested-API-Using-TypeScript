import { Sequelize } from "sequelize-typescript";
import { List } from "../../models/lists";

const connection = new Sequelize("nested_list", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging:false,
  models: [List],
});

export default connection;

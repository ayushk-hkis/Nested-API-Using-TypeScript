"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const lists_1 = require("../../models/lists");
const connection = new sequelize_typescript_1.Sequelize("nested_list", "root", "", {
    dialect: "mysql",
    host: "localhost",
    logging: false,
    models: [lists_1.List],
});
exports.default = connection;
//# sourceMappingURL=config.js.map
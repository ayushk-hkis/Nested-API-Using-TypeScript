"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lists_1 = __importDefault(require("./routes/lists"));
const config_1 = __importDefault(require("./db/config/config"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 5050;
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use("/list", lists_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
config_1.default
    .sync()
    .then(() => {
    console.log("Database synced successfully");
})
    .catch((err) => {
    console.log("Error", err);
});
app.listen(PORT, () => {
    console.log(`App is running on port no. http://localhost:${PORT}/list.`);
});
//# sourceMappingURL=server.js.map
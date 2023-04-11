"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lists_1 = require("../controllers/lists");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", lists_1.getList);
router.post("/:id?", auth_1.validation, lists_1.addList);
router.put("/:id", lists_1.updateList);
router.delete("/:id", lists_1.deleteList);
exports.default = router;
//# sourceMappingURL=lists.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const joi_1 = __importDefault(require("joi"));
const response_1 = require("../utils/response");
const validation = (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        title: joi_1.default.string().required(),
    })
        .unknown(false);
    const { error } = schema.validate(req.body);
    if (error) {
        const { details } = error;
        return res
            .status(response_1.ResCode.VALIDATION_ERROR)
            .json({ status: response_1.ResCode.VALIDATION_ERROR, message: details[0].message });
    }
    else {
        next();
    }
};
exports.validation = validation;
//# sourceMappingURL=auth.js.map
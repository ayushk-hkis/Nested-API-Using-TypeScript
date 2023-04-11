"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteList = exports.updateList = exports.addList = exports.getList = void 0;
const lists_1 = require("../models/lists");
const response_1 = require("../utils/response");
const getList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const finalData = yield lists_1.List.findAll();
        const filter = (f) => {
            const main = [];
            for (let i = 0; i < f.length; i++) {
                const obj = {
                    id: f[i].id,
                    title: f[i].title,
                    child: [],
                };
                if (f[i].parent === 0) {
                    main.push(obj);
                }
                else {
                    const addToParent = (parent, child) => {
                        if (parent.id === child.parent) {
                            parent.child.push(child);
                            return true;
                        }
                        else if (parent.child && parent.child.length) {
                            for (let i = 0; i < parent.child.length; i++) {
                                const found = addToParent(parent.child[i], child);
                                if (found)
                                    return true;
                            }
                        }
                        return false;
                    };
                    const child = {
                        id: f[i].id,
                        title: f[i].title,
                        parent: f[i].parent,
                        child: [],
                    };
                    const addedToParent = addToParent({ child: main }, child);
                    if (!addedToParent) {
                        filter([child]).forEach((c) => main.push(c));
                    }
                }
            }
            return main;
        };
        return res.status(response_1.ResCode.SUCCESS).json({
            status: response_1.ResCode.SUCCESS,
            message: response_1.messages.LIST_DATA,
            data: filter(finalData),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(response_1.ResCode.SERVER_ERROR).json({
            status: response_1.ResCode.SERVER_ERROR,
            message: response_1.messages.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getList = getList;
const addList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { title } = req.body;
        const addTitle = { title };
        if (id) {
            const user = yield lists_1.List.findByPk(id);
            if (!user) {
                return res.json({
                    statusCode: response_1.ResCode.NOT_FOUND,
                    message: response_1.messages.NOT_FOUND,
                });
            }
            addTitle.parent = id;
        }
        const addElemToList = yield lists_1.List.create(addTitle);
        return res.status(response_1.ResCode.CREATED).json({
            status: response_1.ResCode.CREATED,
            message: response_1.messages.ELEMENT_ADDED,
            data: addElemToList,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(response_1.ResCode.SERVER_ERROR).json({
            status: response_1.ResCode.SERVER_ERROR,
            message: response_1.messages.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.addList = addList;
const updateList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { title } = req.body;
        const item = yield lists_1.List.findByPk(id);
        if (!item) {
            return res
                .status(response_1.ResCode.NOT_FOUND)
                .json({ status: response_1.ResCode.NOT_FOUND, message: response_1.messages.NOT_FOUND });
        }
        const updateElem = { title };
        yield lists_1.List.update(updateElem, { where: { id } });
        return res.status(response_1.ResCode.CREATED).json({
            status: response_1.ResCode.CREATED,
            message: response_1.messages.ELEMENT_UPDATED,
            data: yield lists_1.List.findByPk(id),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(response_1.ResCode.SERVER_ERROR).json({
            status: response_1.ResCode.SERVER_ERROR,
            message: response_1.messages.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.updateList = updateList;
const deleteList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const item = yield lists_1.List.findByPk(id);
        if (!item) {
            return res
                .status(response_1.ResCode.NOT_FOUND)
                .json({ status: response_1.ResCode.NOT_FOUND, message: response_1.messages.NOT_FOUND });
        }
        const deleteChildItems = (parentId) => __awaiter(void 0, void 0, void 0, function* () {
            const children = yield lists_1.List.findAll({ where: { parent: parentId } });
            for (const child of children) {
                yield deleteChildItems(child.id);
            }
            yield lists_1.List.destroy({ where: { parent: parentId } });
        });
        yield deleteChildItems(id);
        yield item.destroy();
        return res
            .status(response_1.ResCode.SUCCESS)
            .json({ status: response_1.ResCode.SUCCESS, message: response_1.messages.ELEMENT_DELETED });
    }
    catch (error) {
        console.log(error);
        return res.status(response_1.ResCode.SERVER_ERROR).json({
            status: response_1.ResCode.SERVER_ERROR,
            message: response_1.messages.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.deleteList = deleteList;
//# sourceMappingURL=lists.js.map
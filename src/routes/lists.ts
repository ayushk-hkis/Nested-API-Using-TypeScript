import { Router } from "express";
import { getList, addList, updateList, deleteList } from "../controllers/lists";
import { validation } from "../middleware/auth";

const router = Router();

router.get("/", getList);
router.post("/:id?", validation, addList);
router.put("/:id", updateList);
router.delete("/:id", deleteList);

export default router;

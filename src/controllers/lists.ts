import { RequestHandler } from "express";
import { List } from "../models/lists";
import { ResCode, messages } from "../utils/response";

export const getList: RequestHandler = async (req, res, next) => {
  try {
    const finalData: List[] | any = await List.findAll();
    interface TreeNode {
      id: number;
      title: string;
      parent?: number;
      child: TreeNode[];
    }

    interface List {
      id: number;
      title: string;
      parent?: number;
      child: List[];
    }

    const filter = (f: List[]): TreeNode[] => {
      const main: TreeNode[] = [];

      for (let i = 0; i < f.length; i++) {
        const obj: TreeNode = {
          id: f[i].id,
          title: f[i].title,
          child: [],
        };

        if (f[i].parent === 0) {
          main.push(obj);
        } else {
          const addToParent = (parent: TreeNode, child: TreeNode) => {
            if (parent.id === child.parent) {
              parent.child.push(child);
              return true;
            } else if (parent.child && parent.child.length) {
              for (let i = 0; i < parent.child.length; i++) {
                const found = addToParent(parent.child[i], child);
                if (found) return true;
              }
            }
            return false;
          };

          const child: TreeNode = {
            id: f[i].id,
            title: f[i].title,
            parent: f[i].parent,
            child: [],
          };
          const addedToParent = addToParent({ child: main } as TreeNode, child);

          if (!addedToParent) {
            filter([child]).forEach((c) => main.push(c));
          }
        }
      }
      return main;
    };

    return res.status(ResCode.SUCCESS).json({
      status: ResCode.SUCCESS,
      message: messages.LIST_DATA,
      data: filter(finalData),
    });
  } catch (error) {
    console.log(error);

    return res.status(ResCode.SERVER_ERROR).json({
      status: ResCode.SERVER_ERROR,
      message: messages.INTERNAL_SERVER_ERROR,
    });
  }
};

export const addList: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title } = req.body;
    const addTitle: any = { title };

    if (id) {
      const user: List | null = await List.findByPk(id);
      if (!user) {
        return res.json({
          statusCode: ResCode.NOT_FOUND,
          message: messages.NOT_FOUND,
        });
      }
      addTitle.parent = id;
    }

    const addElemToList = await List.create(addTitle);

    return res.status(ResCode.CREATED).json({
      status: ResCode.CREATED,
      message: messages.ELEMENT_ADDED,
      data: addElemToList,
    });
  } catch (error) {
    console.log(error);

    return res.status(ResCode.SERVER_ERROR).json({
      status: ResCode.SERVER_ERROR,
      message: messages.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateList: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title } = req.body;
    const item: List | null = await List.findByPk(id);

    if (!item) {
      return res
        .status(ResCode.NOT_FOUND)
        .json({ status: ResCode.NOT_FOUND, message: messages.NOT_FOUND });
    }

    const updateElem = { title };
    await List.update(updateElem, { where: { id } });

    return res.status(ResCode.CREATED).json({
      status: ResCode.CREATED,
      message: messages.ELEMENT_UPDATED,
      data: await List.findByPk(id),
    });
  } catch (error) {
    console.log(error);

    return res.status(ResCode.SERVER_ERROR).json({
      status: ResCode.SERVER_ERROR,
      message: messages.INTERNAL_SERVER_ERROR,
    });
  }
};

export const deleteList: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item: List | null = await List.findByPk(id);

    if (!item) {
      return res
        .status(ResCode.NOT_FOUND)
        .json({ status: ResCode.NOT_FOUND, message: messages.NOT_FOUND });
    }

    const deleteChildItems = async (parentId: any): Promise<void> => {
      const children = await List.findAll({ where: { parent: parentId } });
      for (const child of children) {
        await deleteChildItems(child.id);
      }
      await List.destroy({ where: { parent: parentId } });
    };

    await deleteChildItems(id);

    await item.destroy();

    return res
      .status(ResCode.SUCCESS)
      .json({ status: ResCode.SUCCESS, message: messages.ELEMENT_DELETED });
  } catch (error) {
    console.log(error);

    return res.status(ResCode.SERVER_ERROR).json({
      status: ResCode.SERVER_ERROR,
      message: messages.INTERNAL_SERVER_ERROR,
    });
  }
};

import Joi from "joi";
import { RequestHandler } from "express";
import { ResCode } from "../utils/response";

export const validation: RequestHandler = (req, res, next) => {
  const schema = Joi.object()
    .keys({
      title: Joi.string().required(),
    })
    .unknown(false);

  const { error } = schema.validate(req.body);

  if (error) {
    const { details } = error;
    return res
      .status(ResCode.VALIDATION_ERROR)
      .json({ status: ResCode.VALIDATION_ERROR, message: details[0].message });
  } else {
    next();
  }
};

import Joi from "joi";

export const createItemSchema = Joi.object({
  buyer: Joi.string().min(2).max(255).required(),
  soldItem: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow("").max(255).optional(),
  priceInLari: Joi.number().positive().required(),
  priceInEuros: Joi.number().positive().required(),
  pricePayedByClient: Joi.number().positive().required(),
  priceOfTransport: Joi.number().min(0).required(),
  totalProfit: Joi.number().optional(),
  dealDate: Joi.date().iso().optional().allow(null),
});

export const updateItemSchema = Joi.object({
  buyer: Joi.string().min(2).max(255).optional(),
  soldItem: Joi.string().min(2).max(255).optional(),
  description: Joi.string().allow("").max(255).optional(),
  priceInLari: Joi.number().positive().optional(),
  priceInEuros: Joi.number().positive().optional(),
  pricePayedByClient: Joi.number().positive().optional(),
  priceOfTransport: Joi.number().min(0).optional(),
  totalProfit: Joi.number().optional(),
  dealDate: Joi.date().iso().optional().allow(null),
});

import Joi from "joi";

export const createItemSchema = Joi.object({
  buyer: Joi.string().min(2).max(255).required(),
  soldItem: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(0).max(255),
  priceInLari: Joi.number().positive().required(),
  priceInEuros: Joi.number().positive().required(),
  pricePayedByClient: Joi.number().positive().required(),
  priceOfTransport: Joi.number().positive().required(),
  totalProfit: Joi.number().positive(),
});

export const updateItemSchema = Joi.object({
  buyer: Joi.string().min(2).max(255),
  soldItem: Joi.string().min(2).max(255),
  description: Joi.string().min(0).max(255),
  priceInLari: Joi.number().positive(),
  priceInEuros: Joi.number().positive(),
  pricePayedByClient: Joi.number().positive(),
  priceOfTransport: Joi.number().positive(),
  totalProfit: Joi.number().positive(),
});

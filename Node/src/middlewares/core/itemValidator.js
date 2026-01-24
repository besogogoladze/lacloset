import Joi from "joi";

// const translationSchema = Joi.object({
//   en: Joi.string().min(2).max(255).required(),
//   fr: Joi.string().min(2).max(255).required(),
//   ka: Joi.string().min(2).max(255).required(),
//   ru: Joi.string().min(2).max(255).required(),
// });

export const createItemSchema = Joi.object({
  nom: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(2).max(255).required(),
  price: Joi.number().positive().required(),
  priceInLari: Joi.number().positive().required(),
  image_url: Joi.string().uri().required(),
  size: Joi.string().min(2).max(255).required(),
  status: Joi.boolean(),
});

export const updateItemSchema = Joi.object({
  nom: Joi.string().min(2).max(255),
  description: Joi.string().min(2).max(255),
  price: Joi.number().positive(),
  priceInLari: Joi.number().positive(),
  image_url: Joi.string().uri(),
  size: Joi.string().min(2).max(255),
  status: Joi.boolean(),
});

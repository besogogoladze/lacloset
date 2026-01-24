import Joi from "joi";

const signUpSchema = Joi.object({
  // regular expression for email
  // min 6 characters , max 60 characters
  // must be a valid email format with com , net , org
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net", "org"] },
    })
    .messages({
      "string.min": "Email must be at least 6 characters long",
      "string.max": "Email must be at most 60 characters long",
      "string.email": "Email must be a valid email address (com,net,org)",
      "any.required": "Email is required",
    }),
  // regular expression for password
  // at least one lowercase letter,
  // one uppercase letter,
  // one special character,
  // at least one digit
  // and minimum 8 characters
  password: Joi.string()
    .min(8)
    .max(30)
    .required()
    .pattern(/^(?=.*[a-z])/, "lowercase")
    .pattern(/^(?=.*[A-Z])/, "uppercase")
    .pattern(/^(?=.*\d)/, "number")
    .pattern(/^(?=.*[^a-zA-Z0-9])/, "special")
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 30 characters.",
      "any.required": "Password is required.",
      "string.pattern.name":
        "Password must include at least one {#name} character.",
    }),
});

const signInSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net", "org"] },
    })
    .messages({
      "string.min": "Email must be at least 6 characters long",
      "string.max": "Email must be at most 60 characters long",
      "string.email": "Email must be a valid email address (com,net,org)",
      "any.required": "Email is required",
    }),
  // password: Joi.string()
  //   .min(8)
  //   .max(30)
  //   .required()
  //   .pattern(/^(?=.*[a-z])/, "lowercase")
  //   .pattern(/^(?=.*[A-Z])/, "uppercase")
  //   .pattern(/^(?=.*\d)/, "number")
  //   .pattern(/^(?=.*[^a-zA-Z0-9])/, "special")
  //   .messages({
  //     "string.min": "Password must be at least 8 characters long.",
  //     "string.max": "Password cannot exceed 30 characters.",
  //     "any.required": "Password is required.",
  //     "string.pattern.name":
  //       "Password must include at least one {#name} character.",
  //   }),
});

const acceptCodeSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net", "org"] },
    })
    .messages({
      "string.min": "Email must be at least 6 characters long",
      "string.max": "Email must be at most 60 characters long",
      "string.email": "Email must be a valid email address (com,net,org)",
      "any.required": "Email is required",
    }),
  providedCode: Joi.number().required(),
});

const acceptFPSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net", "org"] },
    })
    .messages({
      "string.min": "Email must be at least 6 characters long",
      "string.max": "Email must be at most 60 characters long",
      "string.email": "Email must be a valid email address (com,net,org)",
      "any.required": "Email is required",
    }),
  providedCode: Joi.number().required(),
  newPassword: Joi.string()
    .required()
    .pattern(/^(?=.*[a-z])/, "lowercase")
    .pattern(/^(?=.*[A-Z])/, "uppercase")
    .pattern(/^(?=.*\d)/, "number")
    .pattern(/^(?=.*[^a-zA-Z0-9])/, "special")
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 30 characters.",
      "any.required": "Password is required.",
      "string.pattern.name":
        "Password must include at least one {#name} character.",
    }),
});



export {
  signUpSchema,
  signInSchema,
  acceptCodeSchema,
  acceptFPSchema,
};

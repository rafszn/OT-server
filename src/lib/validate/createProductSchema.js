const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name cannot exceed 100 characters",
    "any.required": "Product name is required",
  }),

  description: Joi.string().min(4).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 4 characters long",
    "any.required": "Description is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be less than 0",
    "any.required": "Price is required",
  }),

  discount: Joi.object({
    type: Joi.string().valid("percentage", "fixed").optional(),
    value: Joi.number().min(0).optional(),
    code: Joi.string().trim().optional(),
  }).optional(),

  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity cannot be negative",
    "number.integer": "Quantity must be an integer",
    "any.required": "Quantity is required",
  }),

  category: Joi.string().trim().required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),

  variants: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().trim().required().messages({
          "string.base": "Variant name must be a string",
          "string.empty": "Variant name is required",
          "any.required": "Variant name is required",
        }),
        values: Joi.array()
          .items(
            Joi.string().trim().required().messages({
              "string.base": "Each option must be a string",
              "string.empty": "Option value cannot be empty",
              "any.required": "Option value is required",
            })
          )
          .min(1)
          .required()
          .messages({
            "array.base": "Options must be an array",
            "array.min": "Each variant must have at least one option",
            "any.required": "Options are required",
          }),
      })
    )
    .optional(),

  delivery: Joi.object({
    fee: Joi.number().min(0).required().messages({
      "number.base": "Delivery fee must be a number",
      "number.min": "Delivery fee cannot be negative",
      "any.required": "Delivery fee is required",
    }),
    timeEstimate: Joi.string().trim().optional().messages({
      "string.base": "Delivery time estimate must be a string",
      "string.empty": "Delivery time estimate is required",
      "any.required": "Delivery time estimate is required",
    }),
    terms: Joi.string().allow("").messages({
      "string.base": "Delivery terms must be a string",
    }),
  })
    .optional()
    .messages({
      "object.base": "Delivery must be an object with required fields",
      "any.required": "Delivery information is required",
    }),

  // new
  productType: Joi.string().valid("NEW", "USED").default("NEW"),
  condition: Joi.when("productType", {
    is: "USED",
    then: Joi.string().valid("EXCELLENT", "GOOD", "FAIR").required().messages({
      "any.only": "Condition must be EXCELLENT, GOOD, or FAIR",
      "any.required": "Condition is required for used products",
    }),
    otherwise: Joi.forbidden(),
  }),
  usageDuration: Joi.string().optional(),
  reasonForSelling: Joi.string().optional(),
});

module.exports = createProductSchema;

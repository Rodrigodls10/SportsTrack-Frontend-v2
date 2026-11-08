import Joi from "joi";

export const categorySchema = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty":
                "El nombre de la categoría es obligatorio",

            "string.min":
                "El nombre debe tener al menos 2 caracteres",

            "string.max":
                "El nombre no puede superar los 50 caracteres"
        })
});
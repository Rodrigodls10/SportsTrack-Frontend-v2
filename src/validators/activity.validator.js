import Joi from "joi";

export const activitySchema = Joi.object({
    titulo: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "El título es obligatorio",
            "string.min": "El título debe tener al menos 3 caracteres",
            "string.max": "El título no puede superar los 100 caracteres"
        }),

    descripcion: Joi.string()
        .required()
        .messages({
            "string.empty": "La descripción es obligatoria"
        }),

    duracionMinutos: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "La duración debe ser un número",
            "number.min": "La duración debe ser mayor a 0",
            "any.required": "La duración es obligatoria"
        }),

    fecha: Joi.string()
        .required()
        .messages({
            "string.empty": "La fecha es obligatoria"
        }),

    categoria: Joi.string()
        .required()
        .messages({
            "string.empty": "La categoría es obligatoria"
        })
});
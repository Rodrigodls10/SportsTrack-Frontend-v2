import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "El email es obligatorio",
            "string.email": "El email no es válido"
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": "La contraseña es obligatoria"
        })
});
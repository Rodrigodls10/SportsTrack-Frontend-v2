import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "El usuario es obligatorio",
            "string.min": "El usuario debe tener al menos 3 caracteres",
            "string.max": "El usuario no puede superar los 30 caracteres"
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "El email es obligatorio",
            "string.email": "El email no es válido"
        }),

    password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
        .required()
        .messages({
            "string.empty": "La contraseña es obligatoria",
            "string.min": "La contraseña debe tener al menos 6 caracteres",
            "string.pattern.base": "La contraseña debe contener letras y números"
        }),

    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Las contraseñas no coinciden",
            "any.required": "Debe repetir la contraseña"
        })
});
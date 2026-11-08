import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { registerSchema } from "../../validators/register.validator";
import api from "../../api/api";
import { login } from "../../features/auth.slice";

const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errorRegistro, setErrorRegistro] =
        useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
            isSubmitting
        }
    } = useForm({
        resolver: joiResolver(registerSchema),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        try {
            setErrorRegistro("");

            const respuesta = await api.post(
                "/auth/register",
                data
            );

            localStorage.setItem(
                "token",
                respuesta.data.token
            );

            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    respuesta.data.user
                )
            );

            dispatch(
                login({
                    user: respuesta.data.user,
                    token: respuesta.data.token
                })
            );

            toast.success(
                "Usuario registrado correctamente"
            );

            navigate("/dashboard");

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo registrar el usuario";

            setErrorRegistro(mensaje);

            toast.error(mensaje);
        }
    };

    return (
        <form
            className="auth-form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="auth-field">
                <label htmlFor="username">
                    Usuario
                </label>

                <input
                    type="text"
                    id="username"
                    placeholder="Ingresá tu nombre de usuario"
                    autoComplete="username"
                    {...register("username")}
                />

                {errors.username && (
                    <span className="auth-field-error">
                        {errors.username.message}
                    </span>
                )}
            </div>

            <div className="auth-field">
                <label htmlFor="email">
                    Email
                </label>

                <input
                    type="email"
                    id="email"
                    placeholder="nombre@ejemplo.com"
                    autoComplete="email"
                    {...register("email")}
                />

                {errors.email && (
                    <span className="auth-field-error">
                        {errors.email.message}
                    </span>
                )}
            </div>

            <div className="auth-field">
                <label htmlFor="password">
                    Contraseña
                </label>

                <input
                    type="password"
                    id="password"
                    placeholder="Creá una contraseña"
                    autoComplete="new-password"
                    {...register("password")}
                />

                {errors.password && (
                    <span className="auth-field-error">
                        {errors.password.message}
                    </span>
                )}
            </div>

            <div className="auth-field">
                <label htmlFor="confirmPassword">
                    Repetir contraseña
                </label>

                <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Repetí tu contraseña"
                    autoComplete="new-password"
                    {...register(
                        "confirmPassword"
                    )}
                />

                {errors.confirmPassword && (
                    <span className="auth-field-error">
                        {
                            errors
                                .confirmPassword
                                .message
                        }
                    </span>
                )}
            </div>

            {errorRegistro && (
                <div className="auth-form-error">
                    {errorRegistro}
                </div>
            )}

            <button
                className="auth-submit-button"
                type="submit"
                disabled={
                    !isValid ||
                    isSubmitting
                }
            >
                {isSubmitting
                    ? "Registrando..."
                    : "Crear cuenta"}
            </button>
        </form>
    );
};

export default RegisterForm;
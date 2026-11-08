import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { loginSchema } from "../../validators/login.validator";
import api from "../../api/api";
import { login } from "../../features/auth.slice";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errorLogin, setErrorLogin] =
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
        resolver: joiResolver(loginSchema),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        try {
            setErrorLogin("");

            const respuesta = await api.post(
                "/auth/login",
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
                "Sesión iniciada correctamente"
            );

            navigate("/dashboard");

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo iniciar sesión";

            setErrorLogin(mensaje);

            toast.error(mensaje);
        }
    };

    return (
        <form
            className="auth-form"
            onSubmit={handleSubmit(onSubmit)}
        >
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
                    placeholder="Ingresá tu contraseña"
                    autoComplete="current-password"
                    {...register("password")}
                />

                {errors.password && (
                    <span className="auth-field-error">
                        {errors.password.message}
                    </span>
                )}
            </div>

            {errorLogin && (
                <div className="auth-form-error">
                    {errorLogin}
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
                    ? "Ingresando..."
                    : "Ingresar"}
            </button>
        </form>
    );
};

export default LoginForm;
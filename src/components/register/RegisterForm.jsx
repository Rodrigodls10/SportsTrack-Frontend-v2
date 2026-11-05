import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { registerSchema } from "../../validators/register.validator";
import api from "../../api/api";
import { login } from "../../features/auth.slice";

const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errorRegistro, setErrorRegistro] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        resolver: joiResolver(registerSchema),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        try {
            setErrorRegistro("");

            const respuesta = await api.post("/auth/register", data);

            localStorage.setItem(
                "token",
                respuesta.data.token
            );

            localStorage.setItem(
                "usuario",
                JSON.stringify(respuesta.data.user)
            );

            dispatch(login({
                user: respuesta.data.user,
                token: respuesta.data.token
            }));

            navigate("/dashboard");

        } catch (error) {
            setErrorRegistro(
                error.response?.data?.error ||
                "No se pudo registrar el usuario"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="username">
                    Usuario:
                </label>

                <input
                    type="text"
                    id="username"
                    {...register("username")}
                />

                {errors.username && (
                    <span>
                        {errors.username.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="email">
                    Email:
                </label>

                <input
                    type="email"
                    id="email"
                    {...register("email")}
                />

                {errors.email && (
                    <span>
                        {errors.email.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="password">
                    Contraseña:
                </label>

                <input
                    type="password"
                    id="password"
                    {...register("password")}
                />

                {errors.password && (
                    <span>
                        {errors.password.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword">
                    Repetir contraseña:
                </label>

                <input
                    type="password"
                    id="confirmPassword"
                    {...register("confirmPassword")}
                />

                {errors.confirmPassword && (
                    <span>
                        {errors.confirmPassword.message}
                    </span>
                )}
            </div>

            {errorRegistro && (
                <p>{errorRegistro}</p>
            )}

            <button
                type="submit"
                disabled={!isValid}
            >
                Registrarse
            </button>
        </form>
    );
};

export default RegisterForm;
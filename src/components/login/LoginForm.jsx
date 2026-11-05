import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginSchema } from "../../validators/login.validator";
import api from "../../api/api";
import { login } from "../../features/auth.slice";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errorLogin, setErrorLogin] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        resolver: joiResolver(loginSchema),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        try {
            setErrorLogin("");

            const respuesta = await api.post("/auth/login", data);

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
            setErrorLogin(
                error.response?.data?.error ||
                "No se pudo iniciar sesión"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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

            {errorLogin && (
                <p>
                    {errorLogin}
                </p>
            )}

            <button
                type="submit"
                disabled={!isValid}
            >
                Ingresar
            </button>
        </form>
    );
};

export default LoginForm;
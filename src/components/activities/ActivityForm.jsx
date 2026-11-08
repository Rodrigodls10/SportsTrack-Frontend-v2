import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "../../api/api";
import { activitySchema } from "../../validators/activity.validator";

const ActivityForm = ({
    totalActividades,
    onActividadCreada
}) => {
    const token = useSelector(
        state => state.auth.token
    );

    const usuario = useSelector(
        state => state.auth.user
    );

    const categorias = useSelector(
        state => state.categories.categorias
    );

    const [errorActividad, setErrorActividad] =
        useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isValid,
            isSubmitting
        }
    } = useForm({
        resolver: joiResolver(activitySchema),
        mode: "onChange"
    });

    const alcanzoLimite =
        usuario?.plan === "PLUS" &&
        totalActividades >= 4;

    const onSubmit = async (data) => {
        if (alcanzoLimite) {
            const mensaje =
                "Tu plan PLUS permite un máximo de 4 actividades";

            setErrorActividad(mensaje);

            toast.error(mensaje);

            return;
        }

        try {
            setErrorActividad("");

            await api.post(
                "/activities",
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await onActividadCreada();

            reset();

            toast.success(
                "Actividad creada correctamente"
            );

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo crear la actividad";

            setErrorActividad(
                mensaje
            );

            toast.error(
                mensaje
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>
                Nueva actividad
            </h2>

            <div>
                <label htmlFor="titulo">
                    Título:
                </label>

                <input
                    type="text"
                    id="titulo"
                    {...register("titulo")}
                />

                {errors.titulo && (
                    <span>
                        {errors.titulo.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="descripcion">
                    Descripción:
                </label>

                <textarea
                    id="descripcion"
                    {...register("descripcion")}
                />

                {errors.descripcion && (
                    <span>
                        {errors.descripcion.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="duracionMinutos">
                    Duración en minutos:
                </label>

                <input
                    type="number"
                    id="duracionMinutos"
                    {...register(
                        "duracionMinutos",
                        {
                            valueAsNumber: true
                        }
                    )}
                />

                {errors.duracionMinutos && (
                    <span>
                        {
                            errors
                                .duracionMinutos
                                .message
                        }
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="fecha">
                    Fecha:
                </label>

                <input
                    type="date"
                    id="fecha"
                    {...register("fecha")}
                />

                {errors.fecha && (
                    <span>
                        {errors.fecha.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="categoria">
                    Categoría:
                </label>

                <select
                    id="categoria"
                    {...register("categoria")}
                >
                    <option value="">
                        Seleccionar categoría
                    </option>

                    {categorias.map(
                        categoria => (
                            <option
                                key={categoria._id}
                                value={categoria._id}
                            >
                                {categoria.nombre}
                            </option>
                        )
                    )}
                </select>

                {errors.categoria && (
                    <span>
                        {errors.categoria.message}
                    </span>
                )}
            </div>

            {errorActividad && (
                <p>
                    {errorActividad}
                </p>
            )}

            {alcanzoLimite && (
                <p>
                    Alcanzaste el límite de 4
                    actividades de tu plan PLUS.
                </p>
            )}

            <button
                type="submit"
                disabled={
                    !isValid ||
                    alcanzoLimite ||
                    isSubmitting
                }
            >
                {isSubmitting
                    ? "Creando..."
                    : "Agregar actividad"}
            </button>
        </form>
    );
};

export default ActivityForm;
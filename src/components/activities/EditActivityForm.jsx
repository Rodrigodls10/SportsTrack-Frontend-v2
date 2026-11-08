import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "../../api/api";
import { activitySchema } from "../../validators/activity.validator";

const EditActivityForm = ({
    actividad,
    cancelarEdicion,
    onActividadEditada
}) => {
    const token = useSelector(
        state => state.auth.token
    );

    const categorias = useSelector(
        state => state.categories.categorias
    );

    const [errorActividad, setErrorActividad] =
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
        resolver: joiResolver(activitySchema),
        mode: "onChange",

        defaultValues: {
            titulo: actividad.titulo,

            descripcion:
                actividad.descripcion,

            duracionMinutos:
                actividad.duracionMinutos,

            fecha:
                actividad.fecha
                    ? actividad.fecha.split("T")[0]
                    : "",

            categoria:
                actividad.categoria?._id ||
                actividad.categoria
        }
    });

    const onSubmit = async (data) => {
        try {
            setErrorActividad("");

            await api.patch(
                `/activities/${actividad._id}`,
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await onActividadEditada();

            toast.success(
                "Actividad modificada correctamente"
            );

            cancelarEdicion();

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo modificar la actividad";

            setErrorActividad(
                mensaje
            );

            toast.error(
                mensaje
            );
        }
    };

    return (
        <form
            onSubmit={
                handleSubmit(onSubmit)
            }
        >
            <h3>
                Editar actividad
            </h3>

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
                        {
                            errors.descripcion.message
                        }
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
                        {
                            errors.categoria.message
                        }
                    </span>
                )}
            </div>

            {errorActividad && (
                <p>
                    {errorActividad}
                </p>
            )}

            <button
                type="submit"
                disabled={
                    !isValid ||
                    isSubmitting
                }
            >
                {isSubmitting
                    ? "Guardando..."
                    : "Guardar cambios"}
            </button>

            <button
                type="button"
                onClick={
                    cancelarEdicion
                }
                disabled={
                    isSubmitting
                }
            >
                Cancelar
            </button>
        </form>
    );
};

export default EditActivityForm;
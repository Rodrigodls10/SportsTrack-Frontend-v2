import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";

import api from "../../api/api";
import { activitySchema } from "../../validators/activity.validator";
import { cargarActividades } from "../../features/activities.slice";

const EditActivityForm = ({
    actividad,
    cancelarEdicion
}) => {
    const dispatch = useDispatch();

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
            isValid
        }
    } = useForm({
        resolver: joiResolver(activitySchema),
        mode: "onChange",

        defaultValues: {
            titulo:
                actividad.titulo,

            descripcion:
                actividad.descripcion,

            duracionMinutos:
                actividad.duracionMinutos,

            fecha:
                actividad.fecha
                    ? actividad.fecha.substring(0, 10)
                    : "",

            categoria:
                actividad.categoria?._id ||
                actividad.categoria ||
                ""
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

            const respuesta = await api.get(
                "/activities",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            dispatch(
                cargarActividades(
                    respuesta.data
                )
            );

            cancelarEdicion();

        } catch (error) {
            setErrorActividad(
                error.response?.data?.error ||
                "No se pudo modificar la actividad"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Editar actividad</h3>

            <div>
                <label htmlFor="edit-titulo">
                    Título:
                </label>

                <input
                    type="text"
                    id="edit-titulo"
                    {...register("titulo")}
                />

                {errors.titulo && (
                    <span>
                        {errors.titulo.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="edit-descripcion">
                    Descripción:
                </label>

                <textarea
                    id="edit-descripcion"
                    {...register("descripcion")}
                />

                {errors.descripcion && (
                    <span>
                        {errors.descripcion.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="edit-duracion">
                    Duración en minutos:
                </label>

                <input
                    type="number"
                    id="edit-duracion"
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
                <label htmlFor="edit-fecha">
                    Fecha:
                </label>

                <input
                    type="date"
                    id="edit-fecha"
                    {...register("fecha")}
                />

                {errors.fecha && (
                    <span>
                        {errors.fecha.message}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor="edit-categoria">
                    Categoría:
                </label>

                <select
                    id="edit-categoria"
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
                <p>{errorActividad}</p>
            )}

            <button
                type="submit"
                disabled={!isValid}
            >
                Guardar cambios
            </button>

            <button
                type="button"
                onClick={cancelarEdicion}
            >
                Cancelar
            </button>
        </form>
    );
};

export default EditActivityForm;
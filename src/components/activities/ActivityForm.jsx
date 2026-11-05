import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";

import api from "../../api/api";
import { activitySchema } from "../../validators/activity.validator";
import { cargarActividades } from "../../features/activities.slice";

const ActivityForm = () => {
    const dispatch = useDispatch();

    const token = useSelector(
        state => state.auth.token
    );

    const categorias = useSelector(
        state => state.categories.categorias
    );

    const [errorActividad, setErrorActividad] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm({
        resolver: joiResolver(activitySchema),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        try {
            setErrorActividad("");

            await api.post(
                "/activities",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const respuesta = await api.get(
                "/activities",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            dispatch(
                cargarActividades(respuesta.data)
            );

            reset();

        } catch (error) {
            setErrorActividad(
                error.response?.data?.error ||
                "No se pudo crear la actividad"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Nueva actividad</h2>

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
                        { valueAsNumber: true }
                    )}
                />

                {errors.duracionMinutos && (
                    <span>
                        {errors.duracionMinutos.message}
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

                    {categorias.map(categoria => (
                        <option
                            key={categoria._id}
                            value={categoria._id}
                        >
                            {categoria.nombre}
                        </option>
                    ))}
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
                Agregar actividad
            </button>
        </form>
    );
};

export default ActivityForm;
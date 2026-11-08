import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "../../api/api";
import { categorySchema } from "../../validators/category.validator";

const CategoryForm = ({
    onCategoriaCreada
}) => {
    const token = useSelector(
        state => state.auth.token
    );

    const [errorCategoria, setErrorCategoria] =
        useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isValid
        }
    } = useForm({
        resolver: joiResolver(
            categorySchema
        ),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        try {
            setErrorCategoria("");

            await api.post(
                "/categories",
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await onCategoriaCreada();

            reset();

            toast.success(
                "Categoría creada correctamente"
            );

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo crear la categoría";

            setErrorCategoria(
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
            <h2>
                Nueva categoría
            </h2>

            <div>
                <label htmlFor="nombre">
                    Nombre:
                </label>

                <input
                    type="text"
                    id="nombre"
                    {...register("nombre")}
                />

                {errors.nombre && (
                    <span>
                        {
                            errors.nombre.message
                        }
                    </span>
                )}
            </div>

            {errorCategoria && (
                <p>
                    {errorCategoria}
                </p>
            )}

            <button
                type="submit"
                disabled={!isValid}
            >
                Crear categoría
            </button>
        </form>
    );
};

export default CategoryForm;
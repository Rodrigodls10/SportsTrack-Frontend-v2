import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "../../api/api";
import { categorySchema } from "../../validators/category.validator";

const EditCategoryForm = ({
    categoria,
    cancelarEdicion,
    onCategoriaEditada
}) => {
    const token = useSelector(
        state => state.auth.token
    );

    const [errorCategoria, setErrorCategoria] =
        useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid
        }
    } = useForm({
        resolver: joiResolver(
            categorySchema
        ),
        mode: "onChange",
        defaultValues: {
            nombre: categoria.nombre
        }
    });

    const onSubmit = async (data) => {
        try {
            setErrorCategoria("");

            await api.patch(
                `/categories/${categoria._id}`,
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await onCategoriaEditada();

            cancelarEdicion();

            toast.success(
                "Categoría modificada correctamente"
            );

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo modificar la categoría";

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
            <h3>
                Editar categoría
            </h3>

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
                Guardar cambios
            </button>

            <button
                type="button"
                onClick={
                    cancelarEdicion
                }
            >
                Cancelar
            </button>
        </form>
    );
};

export default EditCategoryForm;
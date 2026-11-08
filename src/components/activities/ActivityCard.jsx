import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "../../api/api";

const ActivityImageUpload = ({
    actividadId,
    onImagenSubida
}) => {
    const token = useSelector(
        state => state.auth.token
    );

    const [imagen, setImagen] =
        useState(null);

    const [error, setError] =
        useState("");

    const [subiendo, setSubiendo] =
        useState(false);

    const subirImagen = async () => {
        if (!imagen) {
            const mensaje =
                "Seleccioná una imagen";

            setError(mensaje);
            toast.error(mensaje);

            return;
        }

        try {
            setError("");
            setSubiendo(true);

            const formData =
                new FormData();

            formData.append(
                "imagen",
                imagen
            );

            await api.post(
                `/activities/${actividadId}/image`,
                formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setImagen(null);

            await onImagenSubida();

            toast.success(
                "Imagen subida correctamente"
            );

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo subir la imagen";

            setError(mensaje);

            toast.error(mensaje);

        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                    setImagen(
                        e.target.files[0]
                    )
                }
            />

            <button
                type="button"
                onClick={subirImagen}
                disabled={
                    !imagen ||
                    subiendo
                }
            >
                {subiendo
                    ? "Subiendo..."
                    : "Subir imagen"}
            </button>

            {error && (
                <p>
                    {error}
                </p>
            )}
        </div>
    );
};

export default ActivityImageUpload;
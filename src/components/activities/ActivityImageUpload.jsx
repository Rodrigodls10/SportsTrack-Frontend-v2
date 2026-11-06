import { useState } from "react";
import { useSelector } from "react-redux";

import api from "../../api/api";

const ActivityImageUpload = ({
    actividadId,
    onImagenSubida
}) => {
    const token = useSelector(
        state => state.auth.token
    );

    const [imagen, setImagen] = useState(null);
    const [error, setError] = useState("");
    const [subiendo, setSubiendo] = useState(false);

    const subirImagen = async () => {
        if (!imagen) {
            setError("Seleccioná una imagen");
            return;
        }

        try {
            setError("");
            setSubiendo(true);

            const formData = new FormData();

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

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "No se pudo subir la imagen"
            );
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
                <p>{error}</p>
            )}
        </div>
    );
};

export default ActivityImageUpload;
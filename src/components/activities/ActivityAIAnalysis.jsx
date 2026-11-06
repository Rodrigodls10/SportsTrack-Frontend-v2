import { useState } from "react";
import { useSelector } from "react-redux";

import api from "../../api/api";

const ActivityAIAnalysis = ({
    actividad,
    onAnalisisActualizado
}) => {
    const token = useSelector(
        state => state.auth.token
    );

    const [analizando, setAnalizando] =
        useState(false);

    const [error, setError] =
        useState("");

    const analizarActividad = async () => {
        try {
            setAnalizando(true);
            setError("");

            await api.post(
                `/activities/${actividad._id}/analyze`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await onAnalisisActualizado();

        } catch (error) {
            if (error.response?.status === 503) {
                setError(
                    "El servicio de IA no está disponible en este momento."
                );

                return;
            }

            setError(
                error.response?.data?.error ||
                "No se pudo analizar la actividad"
            );

        } finally {
            setAnalizando(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={analizarActividad}
                disabled={analizando}
            >
                {analizando
                    ? "Analizando..."
                    : actividad.analisisIA
                        ? "Volver a analizar"
                        : "Analizar con IA"}
            </button>

            {error && (
                <p>{error}</p>
            )}

            {actividad.analisisIA && (
                <div>
                    <h4>Análisis IA</h4>

                    <p>
                        {actividad.analisisIA}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ActivityAIAnalysis;
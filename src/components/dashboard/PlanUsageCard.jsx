import {
    useEffect,
    useState
} from "react";

import {
    useSelector
} from "react-redux";

import api from "../../api/api";
import { toast } from "react-toastify";

const PlanUsageCard = () => {
    const token = useSelector(
        state => state.auth.token
    );

    const usuario = useSelector(
        state => state.auth.user
    );

    const [cantidadActividades, setCantidadActividades] =
        useState(0);

    const [cargando, setCargando] =
        useState(true);

    useEffect(() => {
        const cargarUso = async () => {
            try {
                const respuesta = await api.get(
                    "/activities",
                    {
                        params: {
                            page: 1,
                            limit: 1
                        },

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setCantidadActividades(
                    respuesta.data
                        .paginacion
                        .totalRegistros
                );

            } catch (error) {
                const mensaje =
                    error.response?.data?.error ||
                    error.response?.data?.mensaje ||
                    "No se pudo cargar la información del plan";

                toast.error(
                    mensaje
                );

            } finally {
                setCargando(false);
            }
        };

        cargarUso();

    }, [token]);

    if (cargando) {
        return (
            <div className="plan-usage-card">
                <p className="plan-loading">
                    Cargando información del plan...
                </p>
            </div>
        );
    }

    const esPlus =
        usuario?.plan === "PLUS";

    const porcentajeUso = esPlus
        ? Math.min(
            (cantidadActividades / 4) * 100,
            100
        )
        : 100;

    return (
        <section className="plan-usage-card">

            <div className="plan-usage-header">

                <div>
                    <span className="plan-usage-label">
                        TU SUSCRIPCIÓN
                    </span>

                    <h3>
                        Uso del plan
                    </h3>
                </div>

                <span
                    className={
                        esPlus
                            ? "plan-badge plan-plus"
                            : "plan-badge plan-premium"
                    }
                >
                    {usuario?.plan}
                </span>

            </div>

            {esPlus ? (
                <>
                    <div className="plan-usage-number">

                        <strong>
                            {cantidadActividades}
                        </strong>

                        <span>
                            / 4 actividades
                        </span>

                    </div>

                    <div className="plan-progress-info">

                        <span>
                            Uso del plan
                        </span>

                        <strong>
                            {porcentajeUso.toFixed(0)}%
                        </strong>

                    </div>

                    <div className="plan-progress">

                        <div
                            className="plan-progress-fill"
                            style={{
                                width:
                                    `${porcentajeUso}%`
                            }}
                        />

                    </div>

                    <p className="plan-usage-description">
                        Te quedan{" "}
                        <strong>
                            {
                                Math.max(
                                    4 - cantidadActividades,
                                    0
                                )
                            }
                        </strong>{" "}
                        actividades disponibles
                        en tu plan PLUS.
                    </p>
                </>
            ) : (
                <>
                    <div className="plan-usage-number">

                        <strong>
                            {cantidadActividades}
                        </strong>

                        <span>
                            actividades registradas
                        </span>

                    </div>

                    <p className="plan-usage-description">
                        Tu plan PREMIUM no tiene
                        límite de actividades.
                    </p>
                </>
            )}

        </section>
    );
};

export default PlanUsageCard;
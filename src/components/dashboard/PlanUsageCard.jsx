import {
    useEffect,
    useState
} from "react";

import { useSelector } from "react-redux";

import api from "../../api/api";

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
                console.log(
                    "Error al cargar uso del plan:",
                    error.response?.data ||
                    error.message
                );
            } finally {
                setCargando(false);
            }
        };

        cargarUso();

    }, [token]);

    if (cargando) {
        return (
            <p>
                Cargando información del plan...
            </p>
        );
    }

    const esPlus =
        usuario?.plan === "PLUS";

    const porcentajeUso = esPlus
        ? Math.min(
            (cantidadActividades / 4) * 100,
            100
        )
        : 0;

    return (
        <section>
            <h3>
                Uso del plan
            </h3>

            <p>
                Plan actual:{" "}
                <strong>
                    {usuario?.plan}
                </strong>
            </p>

            {esPlus ? (
                <>
                    <p>
                        Actividades utilizadas:{" "}
                        {cantidadActividades} de 4
                    </p>

                    <p>
                        Uso:{" "}
                        {porcentajeUso.toFixed(0)}%
                    </p>

                    <progress
                        value={cantidadActividades}
                        max="4"
                    />
                </>
            ) : (
                <p>
                    Actividades registradas:{" "}
                    {cantidadActividades}
                </p>
            )}
        </section>
    );
};

export default PlanUsageCard;
import {
    useEffect,
    useState
} from "react";

import {
    useSelector
} from "react-redux";

import {
    Bar
} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import ChartDataLabels
    from "chartjs-plugin-datalabels";

import api from "../../api/api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    ChartDataLabels
);

const ActivityChart = () => {
    const token = useSelector(
        state => state.auth.token
    );

    const [datosGrafico, setDatosGrafico] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const respuesta = await api.get(
                    "/activities",
                    {
                        params: {
                            page: 1,
                            limit: 100
                        },

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const actividades =
                    respuesta.data.actividades;

                const minutosPorCategoria = {};

                actividades.forEach(
                    actividad => {
                        const categoria =
                            actividad.categoria?.nombre ||
                            "Sin categoría";

                        if (
                            !minutosPorCategoria[
                                categoria
                            ]
                        ) {
                            minutosPorCategoria[
                                categoria
                            ] = 0;
                        }

                        minutosPorCategoria[
                            categoria
                        ] +=
                            actividad.duracionMinutos;
                    }
                );

                setDatosGrafico({
                    labels: Object.keys(
                        minutosPorCategoria
                    ),

                    datasets: [
                        {
                            label:
                                "Minutos entrenados",

                            data: Object.values(
                                minutosPorCategoria
                            ),

                            borderRadius: 10,
                            borderSkipped: false,

                            barThickness: 28
                        }
                    ]
                });

            } catch (error) {
                console.log(
                    "Error al cargar gráfico:",
                    error.response?.data ||
                    error.message
                );
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();

    }, [token]);

    if (cargando) {
        return (
            <p>
                Cargando gráfico...
            </p>
        );
    }

    if (
        !datosGrafico ||
        datosGrafico.labels.length === 0
    ) {
        return (
            <p>
                No hay actividades para mostrar.
            </p>
        );
    }

    return (
        <section className="activity-chart-card">
            <div className="activity-chart-header">
                <div>
                    <h3>
                        Minutos por categoría
                    </h3>

                    <p>
                        Distribución de tu tiempo de entrenamiento
                    </p>
                </div>
            </div>

            <div className="activity-chart-wrapper">
                <Bar
                    data={datosGrafico}
                    options={{
                        indexAxis: "y",

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                display: false
                            },

                            tooltip: {
                                enabled: true,

                                callbacks: {
                                    label: context =>
                                        `${context.raw} minutos`
                                }
                            },

                            datalabels: {
                                color: "#ffffff",

                                anchor: "end",

                                align: "right",

                                offset: 8,

                                font: {
                                    weight: "bold",
                                    size: 12
                                },

                                formatter: value =>
                                    `${value} min`
                            }
                        },

                        scales: {
                            x: {
                                beginAtZero: true,

                                grid: {
                                    color:
                                        "rgba(255, 255, 255, 0.05)"
                                },

                                ticks: {
                                    color: "#71717a"
                                },

                                border: {
                                    display: false
                                }
                            },

                            y: {
                                grid: {
                                    display: false
                                },

                                ticks: {
                                    color: "#e4e4e7",

                                    font: {
                                        weight: "600"
                                    }
                                },

                                border: {
                                    display: false
                                }
                            }
                        }
                    }}
                />
            </div>
        </section>
    );
};

export default ActivityChart;
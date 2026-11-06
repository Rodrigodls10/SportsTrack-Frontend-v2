import {
    useEffect,
    useState
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import Navbar from "../components/layout/Navbar";
import ActivityForm from "../components/activities/ActivityForm";
import EditActivityForm from "../components/activities/EditActivityForm";
import ActivityFilters from "../components/activities/ActivityFilters";
import ActivityCard from "../components/activities/ActivityCard";

import api from "../api/api";

import { cargarActividades } from "../features/activities.slice";
import { cargarCategorias } from "../features/categories.slice";

const ActivitiesPage = () => {
    const dispatch = useDispatch();

    const [actividadEditando, setActividadEditando] =
        useState(null);

    const [filtrosActuales, setFiltrosActuales] =
        useState({});

    const token = useSelector(
        state => state.auth.token
    );

    const actividades = useSelector(
        state => state.activities.actividades
    );

    const paginacion = useSelector(
        state => state.activities.paginacion
    );

    const categorias = useSelector(
        state => state.categories.categorias
    );

    const limite = 5;

    const cargarActividadesPagina = async (
        pagina = 1,
        filtros = filtrosActuales
    ) => {
        try {
            const respuesta = await api.get(
                "/activities",
                {
                    params: {
                        ...filtros,
                        page: pagina,
                        limit: limite
                    },

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

        } catch (error) {
            console.log(
                "Error al cargar actividades:",
                error.response?.data ||
                error.message
            );
        }
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const respuestaActividades =
                    await api.get(
                        "/activities",
                        {
                            params: {
                                page: 1,
                                limit: limite
                            },

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                dispatch(
                    cargarActividades(
                        respuestaActividades.data
                    )
                );

                const respuestaCategorias =
                    await api.get(
                        "/categories",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                dispatch(
                    cargarCategorias(
                        respuestaCategorias.data
                    )
                );

            } catch (error) {
                console.log(
                    "Error:",
                    error.response?.data ||
                    error.message
                );
            }
        };

        cargarDatos();

    }, [dispatch, token]);

    const filtrarActividades = async (
        filtros
    ) => {
        setFiltrosActuales(filtros);

        await cargarActividadesPagina(
            1,
            filtros
        );
    };

    const cambiarPagina = async (
        pagina
    ) => {
        await cargarActividadesPagina(
            pagina,
            filtrosActuales
        );
    };

    const eliminarActividad = async (
        id
    ) => {
        const confirmar = window.confirm(
            "¿Seguro que querés eliminar esta actividad?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await api.delete(
                `/activities/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await cargarActividadesPagina(
                paginacion?.paginaActual || 1,
                filtrosActuales
            );

        } catch (error) {
            console.log(
                "Error al eliminar:",
                error.response?.data ||
                error.message
            );
        }
    };

    const obtenerNombreCategoria = (
        categoriaActividad
    ) => {
        const idCategoria =
            categoriaActividad?._id ||
            categoriaActividad;

        const categoria = categorias.find(
            categoria =>
                categoria._id === idCategoria
        );

        return categoria
            ? categoria.nombre
            : "Sin categoría";
    };

    const actualizarActividades = async () => {
        await cargarActividadesPagina(
            paginacion?.paginaActual || 1,
            filtrosActuales
        );
    };

    return (
        <div className="activities-page">
            <Navbar />

            <main className="activities-container">

                <section className="activities-header">
                    <div>
                        <h1>
                            Mis actividades
                        </h1>

                        <p>
                            Gestioná tus entrenamientos,
                            imágenes y análisis deportivos.
                        </p>
                    </div>
                </section>

                <section className="activity-create-section">
                    <ActivityForm />
                </section>

                <section className="activity-filters-section">
                    <ActivityFilters
                        onFiltrar={
                            filtrarActividades
                        }
                    />
                </section>

                <section className="activities-list-section">

                    {actividades.length === 0 ? (
                        <div className="activities-empty">
                            <h3>
                                No se encontraron actividades
                            </h3>

                            <p>
                                Creá una actividad o modificá
                                los filtros de búsqueda.
                            </p>
                        </div>
                    ) : (
                        <div className="activities-grid">

                            {actividades.map(
                                actividad => (
                                    <div
                                        key={
                                            actividad._id
                                        }
                                    >
                                        {actividadEditando ===
                                        actividad._id ? (
                                            <EditActivityForm
                                                actividad={
                                                    actividad
                                                }
                                                cancelarEdicion={() =>
                                                    setActividadEditando(
                                                        null
                                                    )
                                                }
                                            />
                                        ) : (
                                            <ActivityCard
                                                actividad={
                                                    actividad
                                                }
                                                nombreCategoria={
                                                    obtenerNombreCategoria(
                                                        actividad.categoria
                                                    )
                                                }
                                                onEditar={() =>
                                                    setActividadEditando(
                                                        actividad._id
                                                    )
                                                }
                                                onEliminar={() =>
                                                    eliminarActividad(
                                                        actividad._id
                                                    )
                                                }
                                                onActualizar={
                                                    actualizarActividades
                                                }
                                            />
                                        )}
                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

                {paginacion && (
                    <section className="activities-pagination">

                        <button
                            type="button"
                            disabled={
                                paginacion.paginaActual <=
                                1
                            }
                            onClick={() =>
                                cambiarPagina(
                                    paginacion.paginaActual -
                                        1
                                )
                            }
                        >
                            ← Anterior
                        </button>

                        <span>
                            Página{" "}
                            {
                                paginacion.paginaActual
                            }{" "}
                            de{" "}
                            {
                                paginacion.totalPaginas
                            }
                        </span>

                        <button
                            type="button"
                            disabled={
                                paginacion.paginaActual >=
                                paginacion.totalPaginas
                            }
                            onClick={() =>
                                cambiarPagina(
                                    paginacion.paginaActual +
                                        1
                                )
                            }
                        >
                            Siguiente →
                        </button>

                    </section>
                )}

            </main>
        </div>
    );
};

export default ActivitiesPage;
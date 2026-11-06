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
import ActivityImageUpload from "../components/activities/ActivityImageUpload";

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
                        Authorization: `Bearer ${token}`
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

    const filtrarActividades = async (filtros) => {
        setFiltrosActuales(filtros);

        await cargarActividadesPagina(
            1,
            filtros
        );
    };

    const cambiarPagina = async (pagina) => {
        await cargarActividadesPagina(
            pagina,
            filtrosActuales
        );
    };

    const eliminarActividad = async (id) => {
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

    const obtenerNombreCategoria = (categoriaActividad) => {
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

    return (
        <div>
            <Navbar />

            <h1>Mis actividades</h1>

            <ActivityForm />

            <ActivityFilters
                onFiltrar={filtrarActividades}
            />

            {actividades.length === 0 ? (
                <p>
                    No se encontraron actividades.
                </p>
            ) : (
                actividades.map(actividad => (
                    <div key={actividad._id}>

                        {actividadEditando ===
                        actividad._id ? (
                            <EditActivityForm
                                actividad={actividad}
                                cancelarEdicion={() =>
                                    setActividadEditando(
                                        null
                                    )
                                }
                            />
                        ) : (
                            <>
                                <h3>
                                    {actividad.titulo}
                                </h3>

                                <p>
                                    {
                                        actividad.descripcion
                                    }
                                </p>

                                <p>
                                    Duración:{" "}
                                    {
                                        actividad
                                            .duracionMinutos
                                    }{" "}
                                    minutos
                                </p>

                                <p>
                                    Categoría:{" "}
                                    {
                                        obtenerNombreCategoria(
                                            actividad.categoria
                                        )
                                    }
                                </p>

                                <p>
                                    Fecha:{" "}
                                    {new Date(
                                        actividad.fecha
                                    ).toLocaleDateString(
                                        "es-UY"
                                    )}
                                </p>

                                {actividad.imagenUrl && (
                                    <div>
                                        <img
                                            src={
                                                actividad.imagenUrl
                                            }
                                            alt={
                                                actividad.titulo
                                            }
                                            style={{
                                                width: "250px",
                                                maxWidth: "100%",
                                                borderRadius: "10px"
                                            }}
                                        />
                                    </div>
                                )}

                                <ActivityImageUpload
                                    actividadId={
                                        actividad._id
                                    }
                                    onImagenSubida={() =>
                                        cargarActividadesPagina(
                                            paginacion
                                                ?.paginaActual ||
                                                1,
                                            filtrosActuales
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActividadEditando(
                                            actividad._id
                                        )
                                    }
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        eliminarActividad(
                                            actividad._id
                                        )
                                    }
                                >
                                    Eliminar
                                </button>
                            </>
                        )}

                    </div>
                ))
            )}

            {paginacion && (
                <div>
                    <button
                        type="button"
                        disabled={
                            paginacion.paginaActual <= 1
                        }
                        onClick={() =>
                            cambiarPagina(
                                paginacion.paginaActual - 1
                            )
                        }
                    >
                        Anterior
                    </button>

                    <span>
                        Página{" "}
                        {paginacion.paginaActual} de{" "}
                        {paginacion.totalPaginas}
                    </span>

                    <button
                        type="button"
                        disabled={
                            paginacion.paginaActual >=
                            paginacion.totalPaginas
                        }
                        onClick={() =>
                            cambiarPagina(
                                paginacion.paginaActual + 1
                            )
                        }
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivitiesPage;
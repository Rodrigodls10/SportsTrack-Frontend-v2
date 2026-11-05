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

import api from "../api/api";

import { cargarActividades } from "../features/activities.slice";
import { cargarCategorias } from "../features/categories.slice";

const ActivitiesPage = () => {
    const dispatch = useDispatch();

    const [actividadEditando, setActividadEditando] =
        useState(null);

    const token = useSelector(
        state => state.auth.token
    );

    const actividades = useSelector(
        state => state.activities.actividades
    );

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const respuestaActividades = await api.get(
                    "/activities",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                dispatch(
                    cargarActividades(
                        respuestaActividades.data
                    )
                );

                const respuestaCategorias = await api.get(
                    "/categories",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
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
        try {
            const respuesta = await api.get(
                "/activities",
                {
                    params: filtros,

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
                "Error al filtrar:",
                error.response?.data ||
                error.message
            );
        }
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
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const respuesta = await api.get(
                "/activities",
                {
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
                "Error al eliminar:",
                error.response?.data ||
                error.message
            );
        }
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

                        {actividadEditando === actividad._id ? (
                            <EditActivityForm
                                actividad={actividad}
                                cancelarEdicion={() =>
                                    setActividadEditando(null)
                                }
                            />
                        ) : (
                            <>
                                <h3>
                                    {actividad.titulo}
                                </h3>

                                <p>
                                    {actividad.descripcion}
                                </p>

                                <p>
                                    Duración:{" "}
                                    {actividad.duracionMinutos} minutos
                                </p>

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
        </div>
    );
};

export default ActivitiesPage;
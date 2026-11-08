import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    useSelector
} from "react-redux";

import {
    toast
} from "react-toastify";

import Navbar from "../components/layout/Navbar";
import api from "../api/api";

const SportsPage = () => {
    const token = useSelector(
        state => state.auth.token
    );

    const [eventos, setEventos] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const cargarEventos = async () => {
            try {
                setCargando(true);
                setError("");

                const respuesta = await api.get(
                    "/sports/events",
                    {
                        params: {
                            sport: "soccer",
                            league: "eng.1"
                        },

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setEventos(
                    respuesta.data
                );

            } catch (error) {
                const mensaje =
                    error.response?.data?.error ||
                    error.response?.data?.mensaje ||
                    "No se pudieron cargar los eventos";

                setError(
                    mensaje
                );

                toast.error(
                    mensaje
                );

            } finally {
                setCargando(false);
            }
        };

        cargarEventos();

    }, [token]);

    return (
        <div className="sports-page">
            <Navbar />

            <main className="sports-container">

                <section className="sports-header">
                    <h1>
                        Eventos deportivos
                    </h1>

                    <p>
                        Consultá eventos y resultados deportivos.
                    </p>
                </section>

                {cargando && (
                    <div className="sports-message">
                        Cargando eventos...
                    </div>
                )}

                {error && (
                    <div className="sports-message sports-error">
                        {error}
                    </div>
                )}

                {!cargando &&
                    !error &&
                    eventos.length === 0 && (
                        <div className="sports-message">
                            No hay eventos disponibles.
                        </div>
                    )}

                {!cargando &&
                    !error &&
                    eventos.length > 0 && (
                        <section className="sports-grid">

                            {eventos.map(
                                evento => (
                                    <article
                                        key={evento.id}
                                        className="sport-card"
                                    >
                                        <div className="sport-card-header">

                                            <span className="sport-status">
                                                {evento.estado}
                                            </span>

                                            <span className="sport-date">
                                                {new Date(
                                                    evento.fecha
                                                ).toLocaleString()}
                                            </span>

                                        </div>

                                        <h2>
                                            {evento.nombre}
                                        </h2>

                                        <div className="sport-teams">

                                            <div className="sport-team">
                                                <img
                                                    src={
                                                        evento.local.logo
                                                    }
                                                    alt={
                                                        evento.local.nombre
                                                    }
                                                />

                                                <p>
                                                    {
                                                        evento.local.nombre
                                                    }
                                                </p>

                                                <strong>
                                                    {
                                                        evento.local.puntaje
                                                    }
                                                </strong>
                                            </div>

                                            <span className="sport-versus">
                                                -
                                            </span>

                                            <div className="sport-team">
                                                <img
                                                    src={
                                                        evento.visitante.logo
                                                    }
                                                    alt={
                                                        evento.visitante.nombre
                                                    }
                                                />

                                                <p>
                                                    {
                                                        evento.visitante.nombre
                                                    }
                                                </p>

                                                <strong>
                                                    {
                                                        evento.visitante.puntaje
                                                    }
                                                </strong>
                                            </div>

                                        </div>

                                        <Link
                                            to={`/sports/${evento.id}`}
                                            className="sport-detail-link"
                                        >
                                            Ver detalle
                                        </Link>

                                    </article>
                                )
                            )}

                        </section>
                    )}

            </main>
        </div>
    );
};

export default SportsPage;
import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    useSelector
} from "react-redux";

import {
    toast
} from "react-toastify";

import Navbar from "../components/layout/Navbar";
import api from "../api/api";

const SportsEventDetailPage = () => {
    const { id } = useParams();

    const token = useSelector(
        state => state.auth.token
    );

    const [evento, setEvento] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const cargarEvento = async () => {
            try {
                setCargando(true);
                setError("");

                const respuesta = await api.get(
                    `/sports/events/${id}`,
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

                setEvento(
                    respuesta.data
                );

            } catch (error) {
                const mensaje =
                    error.response?.data?.error ||
                    error.response?.data?.mensaje ||
                    "No se pudo cargar el evento";

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

        cargarEvento();

    }, [id, token]);

    return (
        <div className="sport-detail-page">
            <Navbar />

            <main className="sport-detail-container">

                <Link
                    to="/sports"
                    className="sport-back-link"
                >
                    ← Volver a eventos
                </Link>

                {cargando && (
                    <div className="sports-message">
                        Cargando evento...
                    </div>
                )}

                {error && (
                    <div className="sports-message sports-error">
                        {error}
                    </div>
                )}

                {!cargando &&
                    !error &&
                    evento && (
                        <>
                            <section className="sport-detail-header">

                                <span className="sport-status">
                                    {evento.estado}
                                </span>

                                <h1>
                                    {evento.nombre}
                                </h1>

                                <p>
                                    {new Date(
                                        evento.fecha
                                    ).toLocaleString()}
                                </p>

                            </section>

                            <section className="sport-score-card">

                                <div className="sport-detail-team">
                                    <img
                                        src={evento.local.logo}
                                        alt={evento.local.nombre}
                                    />

                                    <h2>
                                        {evento.local.nombre}
                                    </h2>

                                    <strong>
                                        {evento.local.puntaje}
                                    </strong>
                                </div>

                                <div className="sport-score-separator">
                                    -
                                </div>

                                <div className="sport-detail-team">
                                    <img
                                        src={evento.visitante.logo}
                                        alt={evento.visitante.nombre}
                                    />

                                    <h2>
                                        {evento.visitante.nombre}
                                    </h2>

                                    <strong>
                                        {evento.visitante.puntaje}
                                    </strong>
                                </div>

                            </section>

                            <section className="sport-stats-section">

                                <h2>
                                    Estadísticas
                                </h2>

                                <div className="sport-stats-table">

                                    <div className="sport-stats-row sport-stats-header">
                                        <span>
                                            {evento.local.nombre}
                                        </span>

                                        <span>
                                            Estadística
                                        </span>

                                        <span>
                                            {evento.visitante.nombre}
                                        </span>
                                    </div>

                                    <div className="sport-stats-row">
                                        <span>
                                            {evento.local.estadisticas.posesion}%
                                        </span>

                                        <strong>
                                            Posesión
                                        </strong>

                                        <span>
                                            {evento.visitante.estadisticas.posesion}%
                                        </span>
                                    </div>

                                    <div className="sport-stats-row">
                                        <span>
                                            {evento.local.estadisticas.tiros}
                                        </span>

                                        <strong>
                                            Tiros
                                        </strong>

                                        <span>
                                            {evento.visitante.estadisticas.tiros}
                                        </span>
                                    </div>

                                    <div className="sport-stats-row">
                                        <span>
                                            {evento.local.estadisticas.tirosAlArco}
                                        </span>

                                        <strong>
                                            Tiros al arco
                                        </strong>

                                        <span>
                                            {evento.visitante.estadisticas.tirosAlArco}
                                        </span>
                                    </div>

                                    <div className="sport-stats-row">
                                        <span>
                                            {evento.local.estadisticas.corners}
                                        </span>

                                        <strong>
                                            Corners
                                        </strong>

                                        <span>
                                            {evento.visitante.estadisticas.corners}
                                        </span>
                                    </div>

                                    <div className="sport-stats-row">
                                        <span>
                                            {evento.local.estadisticas.faltas}
                                        </span>

                                        <strong>
                                            Faltas
                                        </strong>

                                        <span>
                                            {evento.visitante.estadisticas.faltas}
                                        </span>
                                    </div>

                                    <div className="sport-stats-row">
                                        <span>
                                            {evento.local.estadisticas.amarillas}
                                        </span>

                                        <strong>
                                            Amarillas
                                        </strong>

                                        <span>
                                            {evento.visitante.estadisticas.amarillas}
                                        </span>
                                    </div>

                                    <div className="sport-stats-row">
                                        <span>
                                            {evento.local.estadisticas.rojas}
                                        </span>

                                        <strong>
                                            Rojas
                                        </strong>

                                        <span>
                                            {evento.visitante.estadisticas.rojas}
                                        </span>
                                    </div>

                                </div>

                            </section>

                            {evento.transmisiones.length > 0 && (
                                <section className="sport-broadcast-section">

                                    <h2>
                                        Transmisiones
                                    </h2>

                                    <div className="sport-broadcast-list">

                                        {evento.transmisiones.map(
                                            (
                                                transmision,
                                                index
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="sport-broadcast-item"
                                                >
                                                    <strong>
                                                        {transmision.nombre}
                                                    </strong>

                                                    <span>
                                                        Región:{" "}
                                                        {transmision.region}
                                                    </span>
                                                </div>
                                            )
                                        )}

                                    </div>

                                </section>
                            )}
                        </>
                    )}

            </main>
        </div>
    );
};

export default SportsEventDetailPage;
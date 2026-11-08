import { Link } from "react-router-dom";
import LoginForm from "../components/login/LoginForm";

const LoginPage = () => {
    return (
        <div className="auth-page">
            <div className="auth-background-glow auth-glow-one" />
            <div className="auth-background-glow auth-glow-two" />

            <main className="auth-container">
                <section className="auth-brand-section">
                    <div className="auth-logo">
                        ST
                    </div>

                    <span className="auth-eyebrow">
                        SPORTSTRACK
                    </span>

                    <h1>
                        Entrená.
                        <br />
                        Registrá.
                        <br />
                        <span>Mejorá.</span>
                    </h1>

                    <p>
                        Gestioná tus actividades deportivas,
                        analizá tu rendimiento y llevá el
                        seguimiento de tu progreso en un solo lugar.
                    </p>

                    <div className="auth-feature-list">
                        <div className="auth-feature">
                            <span>✓</span>
                            Registro de actividades
                        </div>

                        <div className="auth-feature">
                            <span>✓</span>
                            Análisis con inteligencia artificial
                        </div>

                        <div className="auth-feature">
                            <span>✓</span>
                            Estadísticas de tu rendimiento
                        </div>
                    </div>
                </section>

                <section className="auth-card">
                    <div className="auth-card-header">
                        <span className="auth-card-label">
                            BIENVENIDO
                        </span>

                        <h2>
                            Iniciar sesión
                        </h2>

                        <p>
                            Ingresá tus datos para acceder
                            a SportsTrack.
                        </p>
                    </div>

                    <LoginForm />

                    <div className="auth-footer">
                        <span>
                            ¿No tenés cuenta?
                        </span>

                        <Link to="/register">
                            Crear una cuenta
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LoginPage;
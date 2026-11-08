import { Link } from "react-router-dom";
import RegisterForm from "../components/register/RegisterForm";

const RegisterPage = () => {
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
                        Empezá.
                        <br />
                        Registrá.
                        <br />
                        <span>Progresá.</span>
                    </h1>

                    <p>
                        Creá tu cuenta para registrar tus actividades,
                        analizar tu rendimiento y seguir tu progreso
                        deportivo desde un solo lugar.
                    </p>

                    <div className="auth-feature-list">
                        <div className="auth-feature">
                            <span>✓</span>
                            Seguimiento de actividades
                        </div>

                        <div className="auth-feature">
                            <span>✓</span>
                            Análisis mediante inteligencia artificial
                        </div>

                        <div className="auth-feature">
                            <span>✓</span>
                            Estadísticas personalizadas
                        </div>
                    </div>
                </section>

                <section className="auth-card">
                    <div className="auth-card-header">
                        <span className="auth-card-label">
                            NUEVA CUENTA
                        </span>

                        <h2>
                            Crear cuenta
                        </h2>

                        <p>
                            Completá tus datos para comenzar
                            a usar SportsTrack.
                        </p>
                    </div>

                    <RegisterForm />

                    <div className="auth-footer">
                        <span>
                            ¿Ya tenés cuenta?
                        </span>

                        <Link to="/login">
                            Iniciar sesión
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default RegisterPage;
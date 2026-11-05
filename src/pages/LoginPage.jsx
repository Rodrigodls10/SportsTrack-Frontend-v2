import { Link } from "react-router-dom";
import LoginForm from "../components/login/LoginForm";

const LoginPage = () => {
    return (
        <div>
            <h1>Login</h1>

            <LoginForm />

            <p>
                ¿No tenés cuenta?{" "}
                <Link to="/register">
                    Registrate
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;
import { Link } from "react-router-dom";
import RegisterForm from "../components/register/RegisterForm";

const RegisterPage = () => {
    return (
        <div>
            <h1>Registro</h1>

            <RegisterForm />

            <p>
                ¿Ya tenés cuenta?{" "}
                <Link to="/login">
                    Iniciá sesión
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;
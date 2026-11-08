import {
    useState
} from "react";

import { toast } from "react-toastify";

import {
    useDispatch,
    useSelector
} from "react-redux";

import api from "../../api/api";

import {
    actualizarUsuario
} from "../../features/auth.slice";

const UpgradePlanButton = () => {
    const dispatch = useDispatch();

    const token = useSelector(
        state => state.auth.token
    );

    const usuario = useSelector(
        state => state.auth.user
    );

    const [actualizando, setActualizando] =
        useState(false);

    const [error, setError] =
        useState("");

    const mejorarPlan = async () => {
        try {
            setActualizando(true);
            setError("");

            const respuesta = await api.patch(
                "/users/plan",
                {
                    plan: "PREMIUM"
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const usuarioActualizado =
                respuesta.data;

            dispatch(
                actualizarUsuario(
                    usuarioActualizado
                )
            );

            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    usuarioActualizado
                )
            );

            toast.success(
                "Plan actualizado a PREMIUM"
            );

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo actualizar el plan";

            setError(
                mensaje
            );

            toast.error(
                mensaje
            );

        } finally {
            setActualizando(false);
        }
    };

    if (usuario?.plan !== "PLUS") {
        return null;
    }

    return (
        <section className="upgrade-plan-card">

            <div>
                <span className="upgrade-label">
                    PREMIUM
                </span>

                <h3>
                    Entrená sin límites
                </h3>

                <p>
                    Pasá a PREMIUM y registrá
                    todas las actividades que quieras.
                </p>
            </div>

            <button
                type="button"
                className="upgrade-plan-button"
                onClick={mejorarPlan}
                disabled={actualizando}
            >
                {actualizando
                    ? "Actualizando..."
                    : "Mejorar a PREMIUM"}
            </button>

            {error && (
                <p className="upgrade-error">
                    {error}
                </p>
            )}

        </section>
    );
};

export default UpgradePlanButton;
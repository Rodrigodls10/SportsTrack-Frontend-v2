import {
    useState
} from "react";

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

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "No se pudo actualizar el plan"
            );
        } finally {
            setActualizando(false);
        }
    };

    if (usuario?.plan !== "PLUS") {
        return null;
    }

    return (
        <div>
            <button
                type="button"
                onClick={mejorarPlan}
                disabled={actualizando}
            >
                {actualizando
                    ? "Actualizando..."
                    : "Mejorar a PREMIUM"}
            </button>

            {error && (
                <p>{error}</p>
            )}
        </div>
    );
};

export default UpgradePlanButton;
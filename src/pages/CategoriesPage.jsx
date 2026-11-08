import {
    useEffect,
    useState
} from "react";

import { toast } from "react-toastify";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    Navigate
} from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import CategoryForm from "../components/categories/CategoryForm";
import EditCategoryForm from "../components/categories/EditCategoryForm";

import api from "../api/api";

import {
    cargarCategorias
} from "../features/categories.slice";

const CategoriesPage = () => {
    const dispatch = useDispatch();

    const usuario = useSelector(
        state => state.auth.user
    );

    const token = useSelector(
        state => state.auth.token
    );

    const categorias = useSelector(
        state => state.categories.categorias
    );

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    const [categoriaEditando, setCategoriaEditando] =
        useState(null);

    const obtenerCategorias = async () => {
        try {
            setCargando(true);
            setError("");

            const respuesta = await api.get(
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
                    respuesta.data
                )
            );

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudieron cargar las categorías";

            setError(mensaje);

            toast.error(mensaje);

        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (usuario?.role !== "ADMIN") {
            return;
        }

        const cargarCategoriasIniciales =
            async () => {
                try {
                    const respuesta =
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
                            respuesta.data
                        )
                    );

                } catch (error) {
                    const mensaje =
                        error.response?.data?.error ||
                        error.response?.data?.mensaje ||
                        "No se pudieron cargar las categorías";

                    setError(mensaje);

                    toast.error(mensaje);

                } finally {
                    setCargando(false);
                }
            };

        cargarCategoriasIniciales();

    }, [
        dispatch,
        token,
        usuario?.role
    ]);

    const eliminarCategoria = async (
        id
    ) => {
        const confirmar = window.confirm(
            "¿Seguro que querés eliminar esta categoría?"
        );

        if (!confirmar) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/categories/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await obtenerCategorias();

            toast.success(
                "Categoría eliminada correctamente"
            );

        } catch (error) {
            const mensaje =
                error.response?.data?.error ||
                error.response?.data?.mensaje ||
                "No se pudo eliminar la categoría";

            setError(
                mensaje
            );

            toast.error(
                mensaje
            );
        }
    };

    if (usuario?.role !== "ADMIN") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return (
        <div className="categories-page">
            <Navbar />

            <main className="categories-container">

                <section className="categories-header">
                    <div>
                        <span className="categories-badge">
                            ADMIN
                        </span>

                        <h1>
                            Administración de categorías
                        </h1>

                        <p>
                            Gestioná las categorías deportivas
                            disponibles en SportsTrack.
                        </p>
                    </div>
                </section>

                <section className="category-create-card">
                    <CategoryForm
                        onCategoriaCreada={
                            obtenerCategorias
                        }
                    />
                </section>

                {cargando && (
                    <div className="categories-message">
                        Cargando categorías...
                    </div>
                )}

                {error && (
                    <div className="categories-message categories-error">
                        {error}
                    </div>
                )}

                {!cargando &&
                    !error &&
                    categorias.length === 0 && (
                        <div className="categories-message">
                            No hay categorías registradas.
                        </div>
                    )}

                {!cargando &&
                    categorias.length > 0 && (
                        <section className="categories-list-section">

                            <div className="categories-list-header">
                                <div>
                                    <h2>
                                        Categorías registradas
                                    </h2>

                                    <p>
                                        {
                                            categorias.length
                                        }{" "}
                                        categoría
                                        {
                                            categorias.length !== 1
                                                ? "s"
                                                : ""
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="categories-grid">

                                {categorias.map(
                                    categoria => (
                                        <article
                                            key={
                                                categoria._id
                                            }
                                            className="category-card"
                                        >
                                            {categoriaEditando ===
                                                categoria._id ? (
                                                <EditCategoryForm
                                                    categoria={
                                                        categoria
                                                    }
                                                    cancelarEdicion={() =>
                                                        setCategoriaEditando(
                                                            null
                                                        )
                                                    }
                                                    onCategoriaEditada={
                                                        obtenerCategorias
                                                    }
                                                />
                                            ) : (
                                                <>
                                                    <div className="category-card-content">
                                                        <div className="category-icon">
                                                            🏅
                                                        </div>

                                                        <div>
                                                            <span className="category-label">
                                                                Categoría
                                                            </span>

                                                            <h3>
                                                                {
                                                                    categoria.nombre
                                                                }
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="category-actions">

                                                        <button
                                                            type="button"
                                                            className="category-edit-button"
                                                            onClick={() =>
                                                                setCategoriaEditando(
                                                                    categoria._id
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="category-delete-button"
                                                            onClick={() =>
                                                                eliminarCategoria(
                                                                    categoria._id
                                                                )
                                                            }
                                                        >
                                                            Eliminar
                                                        </button>

                                                    </div>
                                                </>
                                            )}
                                        </article>
                                    )
                                )}

                            </div>

                        </section>
                    )}

            </main>
        </div>
    );
};

export default CategoriesPage;
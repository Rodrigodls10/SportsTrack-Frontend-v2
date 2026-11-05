import { useState } from "react";
import { useSelector } from "react-redux";

const ActivityFilters = ({ onFiltrar }) => {
    const categorias = useSelector(
        state => state.categories.categorias
    );

    const [titulo, setTitulo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [minDuracion, setMinDuracion] = useState("");
    const [maxDuracion, setMaxDuracion] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const aplicarFiltros = (e) => {
        e.preventDefault();

        const filtros = {};

        if (titulo.trim() !== "") {
            filtros.titulo = titulo;
        }

        if (categoria !== "") {
            filtros.categoria = categoria;
        }

        if (minDuracion !== "") {
            filtros.minDuracion = Number(minDuracion);
        }

        if (maxDuracion !== "") {
            filtros.maxDuracion = Number(maxDuracion);
        }

        if (fechaDesde !== "") {
            filtros.fechaDesde = fechaDesde;
        }

        if (fechaHasta !== "") {
            filtros.fechaHasta = fechaHasta;
        }

        onFiltrar(filtros);
    };

    const limpiarFiltros = () => {
        setTitulo("");
        setCategoria("");
        setMinDuracion("");
        setMaxDuracion("");
        setFechaDesde("");
        setFechaHasta("");

        onFiltrar({});
    };

    return (
        <form onSubmit={aplicarFiltros}>
            <h2>Filtrar actividades</h2>

            <div>
                <label htmlFor="filtroTitulo">
                    Título:
                </label>

                <input
                    type="text"
                    id="filtroTitulo"
                    value={titulo}
                    onChange={(e) =>
                        setTitulo(e.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="filtroCategoria">
                    Categoría:
                </label>

                <select
                    id="filtroCategoria"
                    value={categoria}
                    onChange={(e) =>
                        setCategoria(e.target.value)
                    }
                >
                    <option value="">
                        Todas
                    </option>

                    {categorias.map(categoria => (
                        <option
                            key={categoria._id}
                            value={categoria._id}
                        >
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="minDuracion">
                    Duración mínima:
                </label>

                <input
                    type="number"
                    id="minDuracion"
                    min="1"
                    value={minDuracion}
                    onChange={(e) =>
                        setMinDuracion(e.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="maxDuracion">
                    Duración máxima:
                </label>

                <input
                    type="number"
                    id="maxDuracion"
                    min="1"
                    value={maxDuracion}
                    onChange={(e) =>
                        setMaxDuracion(e.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="fechaDesde">
                    Desde:
                </label>

                <input
                    type="date"
                    id="fechaDesde"
                    value={fechaDesde}
                    onChange={(e) =>
                        setFechaDesde(e.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="fechaHasta">
                    Hasta:
                </label>

                <input
                    type="date"
                    id="fechaHasta"
                    value={fechaHasta}
                    onChange={(e) =>
                        setFechaHasta(e.target.value)
                    }
                />
            </div>

            <button type="submit">
                Filtrar
            </button>

            <button
                type="button"
                onClick={limpiarFiltros}
            >
                Limpiar filtros
            </button>
        </form>
    );
};

export default ActivityFilters;